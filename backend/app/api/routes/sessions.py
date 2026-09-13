from fastapi import APIRouter, Body
from app.services.session_service import (
    create_session,
    get_session_or_404,
    get_full_session_state,
    reset_session,
    update_session,
)
from app.services.phase_service import start_selection
from app.schemas.models import SessionCreate, SessionOut, FullSessionState

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionOut)
def init_session(payload: SessionCreate):
    """Create or return existing session for given token."""
    return create_session(payload.session_token)


@router.get("/{session_token}", response_model=SessionOut)
def read_session(session_token: str):
    """Get basic session details."""
    return get_session_or_404(session_token)


@router.get("/{session_token}/state", response_model=FullSessionState)
def read_full_state(session_token: str):
    """Get complete session state for checkpoint and resume."""
    return get_full_session_state(session_token)


@router.post("/{session_token}/start")
def begin_selection(session_token: str):
    """Start bag selection journey - creates Phase 1."""
    return start_selection(session_token)


@router.patch("/{session_token}")
def update_screen_or_index(session_token: str, payload: dict = Body(...)):
    """Update current screen or bag index for seamless checkpointing."""
    session = get_session_or_404(session_token)
    allowed = {"current_screen", "current_bag_index"}
    updates = {k: v for k, v in payload.items() if k in allowed}
    if updates:
        return update_session(session["id"], updates)
    return session


@router.post("/{session_token}/reset")
def dev_reset(session_token: str):
    """Development tool: fully reset selection session."""
    return reset_session(session_token)
