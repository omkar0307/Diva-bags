from fastapi import APIRouter
from app.services.phase_service import (
    get_current_phase,
    complete_phase,
    confirm_dislikes,
    reconsider_dislikes,
)
from app.services.decision_service import get_disliked_bags
from app.schemas.models import PhaseOut, BagOut

router = APIRouter(prefix="/phases", tags=["phases"])


@router.get("/{session_token}/current", response_model=PhaseOut | None)
def current_phase(session_token: str):
    """Retrieve active phase for session."""
    return get_current_phase(session_token)


@router.get("/{session_token}/disliked-bags", response_model=list[BagOut])
def list_disliked_bags(session_token: str):
    """Get disliked bags in the current phase to review."""
    return get_disliked_bags(session_token)


@router.post("/{session_token}/complete")
def finish_phase(session_token: str):
    """Transition phase to dislike review."""
    return complete_phase(session_token)


@router.post("/{session_token}/confirm-dislikes")
def confirm_eliminations(session_token: str):
    """Confirm elimination of disliked bags and advance to next phase or final."""
    return confirm_dislikes(session_token)


@router.post("/{session_token}/reconsider")
def reconsider(session_token: str):
    """Allow user to reconsider disliked bags."""
    return reconsider_dislikes(session_token)
