from app.core.supabase import get_supabase


def get_active_bags() -> list[dict]:
    """Get all active bags ordered by display_order."""
    sb = get_supabase()
    result = sb.table("bags").select(
        "id, name, image_url, display_order"
    ).eq("is_active", True).order("display_order").execute()
    return result.data
