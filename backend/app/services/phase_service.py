from app.core.supabase import get_supabase
from app.services.session_service import get_session_or_404, update_session
from app.services.bag_service import get_active_bags
from fastapi import HTTPException


def create_phase(session_token: str, phase_number: int, candidate_bag_ids: list[str]) -> dict:
    """Create a new phase for the session."""
    sb = get_supabase()
    session = get_session_or_404(session_token)

    # Check if phase already exists (idempotent)
    existing = sb.table("phases").select("*").eq(
        "session_id", session["id"]
    ).eq("phase_number", phase_number).execute()
    if existing.data:
        return existing.data[0]

    result = sb.table("phases").insert({
        "session_id": session["id"],
        "phase_number": phase_number,
        "status": "in_progress",
        "candidate_bag_ids": candidate_bag_ids,
    }).execute()

    # Update session to point to this phase
    update_session(session["id"], {
        "current_phase_number": phase_number,
        "current_bag_index": 0,
        "current_screen": "selection",
    })

    return result.data[0]


def start_selection(session_token: str) -> dict:
    """Start the selection process - create Phase 1 with all active bags."""
    bags = get_active_bags()
    if not bags:
        raise HTTPException(status_code=400, detail="No bags available")

    bag_ids = [b["id"] for b in bags]

    # If only 1 bag, skip to final
    if len(bag_ids) == 1:
        session = get_session_or_404(session_token)
        update_session(session["id"], {
            "current_screen": "final",
            "final_bag_id": bag_ids[0],
            "status": "active",
        })
        return {"phase": None, "final_bag_id": bag_ids[0]}

    phase = create_phase(session_token, 1, bag_ids)
    return {"phase": phase, "final_bag_id": None}


def get_current_phase(session_token: str) -> dict | None:
    """Get the current phase for a session."""
    sb = get_supabase()
    session = get_session_or_404(session_token)
    if session["current_phase_number"] == 0:
        return None

    result = sb.table("phases").select("*").eq(
        "session_id", session["id"]
    ).eq("phase_number", session["current_phase_number"]).execute()
    return result.data[0] if result.data else None


def complete_phase(session_token: str) -> dict:
    """Mark current phase as reviewing_dislikes (all bags decided)."""
    sb = get_supabase()
    phase = get_current_phase(session_token)
    if not phase:
        raise HTTPException(status_code=400, detail="No current phase")

    session = get_session_or_404(session_token)

    # Update phase status
    sb.table("phases").update({
        "status": "reviewing_dislikes",
    }).eq("id", phase["id"]).execute()

    # Update session screen
    update_session(session["id"], {"current_screen": "dislike_review"})

    return {"status": "reviewing_dislikes"}


def confirm_dislikes(session_token: str) -> dict:
    """Confirm disliked bags are eliminated. Create next phase or final."""
    sb = get_supabase()
    session = get_session_or_404(session_token)
    phase = get_current_phase(session_token)
    if not phase:
        raise HTTPException(status_code=400, detail="No current phase")

    # Mark all disliked as confirmed_dislike
    sb.table("phase_decisions").update({
        "decision": "confirmed_dislike"
    }).eq("phase_id", phase["id"]).eq("decision", "disliked").execute()

    # Complete current phase
    sb.table("phases").update({
        "status": "completed",
        "completed_at": "now()",
    }).eq("id", phase["id"]).execute()

    # Get liked bags
    liked_result = sb.table("phase_decisions").select("bag_id").eq(
        "phase_id", phase["id"]
    ).eq("decision", "liked").execute()

    liked_bag_ids = [d["bag_id"] for d in liked_result.data]

    if len(liked_bag_ids) == 0:
        # Zero bags remain after eliminating all choices!
        update_session(session["id"], {
            "status": "completed",
            "current_screen": "completed",
            "final_bag_id": None,
        })
        return {"next_action": "empty", "final_bag_id": None}

    if len(liked_bag_ids) == 1:
        # We have a winner!
        update_session(session["id"], {
            "current_screen": "final",
            "final_bag_id": liked_bag_ids[0],
        })
        return {"next_action": "final", "final_bag_id": liked_bag_ids[0]}

    # Create next phase
    next_phase_number = phase["phase_number"] + 1
    next_phase = create_phase(session_token, next_phase_number, liked_bag_ids)

    return {"next_action": "next_phase", "phase": next_phase}


def reconsider_dislikes(session_token: str) -> dict:
    """User wants to reconsider disliked bags. Put phase back to in_progress."""
    sb = get_supabase()
    session = get_session_or_404(session_token)
    phase = get_current_phase(session_token)
    if not phase:
        raise HTTPException(status_code=400, detail="No current phase")

    # Get disliked bag ids to know which ones need reconsideration
    disliked_result = sb.table("phase_decisions").select("bag_id").eq(
        "phase_id", phase["id"]
    ).eq("decision", "disliked").execute()
    disliked_bag_ids = [d["bag_id"] for d in disliked_result.data]

    # Remove disliked decisions so user can re-decide them
    sb.table("phase_decisions").delete().eq(
        "phase_id", phase["id"]
    ).eq("decision", "disliked").execute()

    # Count remaining (liked) decisions
    liked_result = sb.table("phase_decisions").select("bag_id").eq(
        "phase_id", phase["id"]
    ).eq("decision", "liked").execute()
    liked_count = len(liked_result.data)

    # Set bag index to the point where reconsideration starts
    # The index is the count of already-decided bags (liked ones)
    update_session(session["id"], {
        "current_screen": "selection",
        "current_bag_index": liked_count,
    })

    # Update phase back to in_progress
    sb.table("phases").update({
        "status": "in_progress",
    }).eq("id", phase["id"]).execute()

    return {"disliked_bag_ids": disliked_bag_ids, "resume_index": liked_count}
