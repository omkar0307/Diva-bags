from fastapi import APIRouter
from app.services.bag_service import get_active_bags
from app.schemas.models import BagOut

router = APIRouter(prefix="/bags", tags=["bags"])


@router.get("", response_model=list[BagOut])
def list_bags():
    """Get all active bags for the showcase."""
    return get_active_bags()
