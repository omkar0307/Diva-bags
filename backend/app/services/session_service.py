from app.core.supabase import get_supabase
from fastapi import HTTPException


def create_session(session_token: str) -> dict:
    """Create a new selection session."""
    sb = get_supabase()
    # Check if session already exists
    existing = sb.table("selection_sessions").select("*").eq(
        "session_token", session_token
    ).execute()
    if existing.data:
        return existing.data[0]

    result = sb.table("selection_sessions").insert({
        "session_token": session_token,
        "current_phase_number": 0,
        "current_bag_index": 0,
        "current_screen": "welcome",
        "status": "active",
    }).execute()
    return result.data[0]


def get_session(session_token: str) -> dict | None:
    """Get session by token."""
    sb = get_supabase()
    result = sb.table("selection_sessions").select("*").eq(
        "session_token", session_token
    ).execute()
    return result.data[0] if result.data else None


def get_session_or_404(session_token: str) -> dict:
    """Get session or raise 404."""
    session = get_session(session_token)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


def update_session(session_id: str, updates: dict) -> dict:
    """Update session fields."""
    sb = get_supabase()
    result = sb.table("selection_sessions").update(updates).eq(
        "id", session_id
    ).execute()
    return result.data[0]


def get_full_session_state(session_token: str) -> dict:
    """Get complete session state for checkpoint/resume."""
    sb = get_supabase()
    session = get_session_or_404(session_token)

    state = {"session": session, "current_phase": None, "decisions": [], "bags": [], "final_bag": None, "message": None}

    # Get current phase
    if session["current_phase_number"] > 0:
        phase_result = sb.table("phases").select("*").eq(
            "session_id", session["id"]
        ).eq("phase_number", session["current_phase_number"]).execute()
        if phase_result.data:
            phase = phase_result.data[0]
            state["current_phase"] = phase

            # Get decisions for current phase
            decisions_result = sb.table("phase_decisions").select("*").eq(
                "phase_id", phase["id"]
            ).execute()
            state["decisions"] = decisions_result.data

            # Get bags for current phase candidates
            if phase["candidate_bag_ids"]:
                bags_result = sb.table("bags").select(
                    "id, name, image_url, display_order"
                ).in_("id", phase["candidate_bag_ids"]).execute()
                # Preserve order from candidate_bag_ids
                bag_map = {b["id"]: b for b in bags_result.data}
                state["bags"] = [bag_map[bid] for bid in phase["candidate_bag_ids"] if bid in bag_map]

    # Get final bag if completed
    if session.get("final_bag_id"):
        bag_result = sb.table("bags").select(
            "id, name, image_url, display_order"
        ).eq("id", session["final_bag_id"]).execute()
        if bag_result.data:
            state["final_bag"] = bag_result.data[0]

    # Get message if exists
    msg_result = sb.table("messages").select("*").eq(
        "session_id", session["id"]
    ).execute()
    if msg_result.data:
        state["message"] = msg_result.data[0]

    return state


def reset_session(session_token: str) -> dict:
    """DEV ONLY: Reset a session completely."""
    sb = get_supabase()
    session = get_session_or_404(session_token)
    session_id = session["id"]

    # Delete messages
    sb.table("messages").delete().eq("session_id", session_id).execute()

    # Get all phases
    phases = sb.table("phases").select("id").eq("session_id", session_id).execute()
    for phase in phases.data:
        sb.table("phase_decisions").delete().eq("phase_id", phase["id"]).execute()
    sb.table("phases").delete().eq("session_id", session_id).execute()

    # Reset session
    result = sb.table("selection_sessions").update({
        "current_phase_number": 0,
        "current_bag_index": 0,
        "current_screen": "welcome",
        "status": "active",
        "final_bag_id": None,
    }).eq("id", session_id).execute()

    return result.data[0]
