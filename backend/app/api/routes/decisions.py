from fastapi import APIRouter
from app.services.decision_service import record_decision, undo_last_decision
from app.schemas.models import DecisionCreate, DecisionOut

router = APIRouter(prefix="/decisions", tags=["decisions"])


@router.post("/{session_token}", response_model=DecisionOut)
def make_decision(session_token: str, payload: DecisionCreate):
    """Record a Like or Dislike decision."""
    return record_decision(
        session_token,
        payload.bag_id,
        payload.decision,
        payload.current_index,
        payload.advance_screen,
    )


@router.delete("/{session_token}/last")
def undo_decision(session_token: str):
    """Undo the previous decision in current phase."""
    return undo_last_decision(session_token)
