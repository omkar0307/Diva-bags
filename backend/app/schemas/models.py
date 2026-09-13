from pydantic import BaseModel
from datetime import datetime


class BagOut(BaseModel):
    id: str
    name: str
    image_url: str
    display_order: int


class SessionCreate(BaseModel):
    session_token: str


class SessionOut(BaseModel):
    id: str
    session_token: str
    current_phase_number: int
    current_bag_index: int
    current_screen: str
    status: str
    final_bag_id: str | None = None
    created_at: str
    updated_at: str


class PhaseOut(BaseModel):
    id: str
    session_id: str
    phase_number: int
    status: str
    candidate_bag_ids: list[str]
    created_at: str
    completed_at: str | None = None


class DecisionCreate(BaseModel):
    bag_id: str
    decision: str  # 'liked' or 'disliked'
    current_index: int | None = None
    advance_screen: bool | None = None


class DecisionOut(BaseModel):
    id: str
    phase_id: str
    bag_id: str
    decision: str
    created_at: str
    updated_at: str


class MessageCreate(BaseModel):
    message_text: str


class MessageOut(BaseModel):
    id: str
    session_id: str
    final_bag_id: str
    message_text: str
    created_at: str


class PhaseStateOut(BaseModel):
    """Full phase state for the frontend to render correctly."""
    phase: PhaseOut
    decisions: list[DecisionOut]
    bags: list[BagOut]


class FullSessionState(BaseModel):
    """Complete session state for checkpoint/resume."""
    session: SessionOut
    current_phase: PhaseOut | None = None
    decisions: list[DecisionOut] = []
    bags: list[BagOut] = []
    final_bag: BagOut | None = None
    message: MessageOut | None = None
