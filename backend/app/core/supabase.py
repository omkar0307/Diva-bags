from supabase import create_client, Client
from app.core.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY

_client: Client | None = None


def get_supabase() -> Client:
    """Get or create the Supabase client (singleton)."""
    global _client
    if _client is None:
        key = SUPABASE_SERVICE_ROLE_KEY if SUPABASE_SERVICE_ROLE_KEY and SUPABASE_SERVICE_ROLE_KEY != "your_service_role_key_here" else SUPABASE_ANON_KEY
        _client = create_client(SUPABASE_URL, key)
    return _client

