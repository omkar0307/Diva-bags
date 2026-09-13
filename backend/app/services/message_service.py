from app.core.supabase import get_supabase
from app.services.session_service import get_session_or_404, update_session
from fastapi import HTTPException


def save_message(session_token: str, message_text: str) -> dict:
    """Save the final message to the boyfriend."""
    sb = get_supabase()
    session = get_session_or_404(session_token)

    if not session.get("final_bag_id"):
        raise HTTPException(status_code=400, detail="No final bag selected yet")

    # Check if message already exists (idempotent)
    existing = sb.table("messages").select("*").eq(
        "session_id", session["id"]
    ).execute()
    if existing.data:
        # Update existing message
        result = sb.table("messages").update({
            "message_text": message_text,
        }).eq("id", existing.data[0]["id"]).execute()
        return result.data[0]

    result = sb.table("messages").insert({
        "session_id": session["id"],
        "final_bag_id": session["final_bag_id"],
        "message_text": message_text,
    }).execute()

    # Mark session as completed
    update_session(session["id"], {
        "current_screen": "completed",
        "status": "completed",
    })

    return result.data[0]


def get_message(session_token: str) -> dict | None:
    """Get message for a session."""
    sb = get_supabase()
    session = get_session_or_404(session_token)
    result = sb.table("messages").select("*").eq(
        "session_id", session["id"]
    ).execute()
    return result.data[0] if result.data else None
