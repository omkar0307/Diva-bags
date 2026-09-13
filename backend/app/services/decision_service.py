from app.core.supabase import get_supabase
from app.services.session_service import get_session_or_404, update_session
from app.services.phase_service import get_current_phase
from fastapi import HTTPException


def record_decision(
    session_token: str,
    bag_id: str,
    decision: str,
    current_index: int | None = None,
    advance_screen: bool | None = None,
) -> dict:
    """Record a like/dislike decision for a bag in the current phase."""
    if decision not in ("liked", "disliked"):
        raise HTTPException(status_code=400, detail="Decision must be 'liked' or 'disliked'")

    sb = get_supabase()
    session = get_session_or_404(session_token)
    phase = get_current_phase(session_token)
    if not phase:
        raise HTTPException(status_code=400, detail="No current phase")

    # Check bag is a candidate in this phase
    if bag_id not in phase["candidate_bag_ids"]:
        raise HTTPException(status_code=400, detail="Bag is not a candidate in this phase")

    # Upsert decision (handles re-decisions safely)
    existing = sb.table("phase_decisions").select("*").eq(
        "phase_id", phase["id"]
    ).eq("bag_id", bag_id).execute()

    if existing.data:
        result = sb.table("phase_decisions").update({
            "decision": decision,
        }).eq("id", existing.data[0]["id"]).execute()
    else:
        result = sb.table("phase_decisions").insert({
            "phase_id": phase["id"],
            "bag_id": bag_id,
            "decision": decision,
        }).execute()

    # Advance or set bag index
    if current_index is not None:
        new_index = current_index
    else:
        new_index = session["current_bag_index"] + 1

    total_candidates = len(phase["candidate_bag_ids"])
    updates: dict = {"current_bag_index": new_index}

    # Check if all candidates have been decided
    all_decisions = sb.table("phase_decisions").select("id").eq(
        "phase_id", phase["id"]
    ).execute()

    should_advance = (
        (advance_screen is True)
        or (advance_screen is None and len(all_decisions.data) >= total_candidates)
    )

    if should_advance and len(all_decisions.data) >= total_candidates:
        updates["current_screen"] = "dislike_review"
        sb.table("phases").update({"status": "reviewing_dislikes"}).eq("id", phase["id"]).execute()

    update_session(session["id"], updates)

    return result.data[0]


def undo_last_decision(session_token: str) -> dict:
    """Undo the last decision in the current phase."""
    sb = get_supabase()
    session = get_session_or_404(session_token)
    phase = get_current_phase(session_token)
    if not phase:
        raise HTTPException(status_code=400, detail="No current phase")

    current_index = session["current_bag_index"]
    if current_index <= 0:
        raise HTTPException(status_code=400, detail="Nothing to undo")

    # Get the previous bag
    prev_index = current_index - 1
    prev_bag_id = phase["candidate_bag_ids"][prev_index]

    # Delete that decision
    sb.table("phase_decisions").delete().eq(
        "phase_id", phase["id"]
    ).eq("bag_id", prev_bag_id).execute()

    # Move index back
    update_session(session["id"], {
        "current_bag_index": prev_index,
        "current_screen": "selection",
    })

    # If phase was in reviewing_dislikes, put it back
    if phase["status"] == "reviewing_dislikes":
        sb.table("phases").update({"status": "in_progress"}).eq("id", phase["id"]).execute()

    return {"undone_bag_id": prev_bag_id, "new_index": prev_index}


def get_decisions_for_phase(phase_id: str) -> list[dict]:
    """Get all decisions for a phase."""
    sb = get_supabase()
    result = sb.table("phase_decisions").select("*").eq(
        "phase_id", phase_id
    ).execute()
    return result.data


def get_disliked_bags(session_token: str) -> list[dict]:
    """Get disliked bags for the current phase with bag details."""
    sb = get_supabase()
    phase = get_current_phase(session_token)
    if not phase:
        return []

    # Get disliked decisions
    decisions = sb.table("phase_decisions").select("bag_id").eq(
        "phase_id", phase["id"]
    ).eq("decision", "disliked").execute()

    if not decisions.data:
        return []

    bag_ids = [d["bag_id"] for d in decisions.data]
    bags = sb.table("bags").select("id, name, image_url, display_order").in_(
        "id", bag_ids
    ).execute()

    return bags.data
