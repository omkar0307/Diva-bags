from fastapi import APIRouter
from app.services.message_service import save_message, get_message
from app.schemas.models import MessageCreate, MessageOut

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/{session_token}", response_model=MessageOut)
def submit_message(session_token: str, payload: MessageCreate):
    """Save girlfriend's message for boyfriend."""
    return save_message(session_token, payload.message_text)


@router.get("/{session_token}", response_model=MessageOut | None)
def read_message(session_token: str):
    """Get saved message for session."""
    return get_message(session_token)
