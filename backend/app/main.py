from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import bags, sessions, phases, decisions, messages
from app.core.config import FRONTEND_URL

app = FastAPI(
    title="Divaaa's Bag Match API 👜💕",
    description="Backend API for Divaaa's shoulder bag selection experience",
    version="1.0.0",
)

# CORS configuration
origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open in local dev to ensure mobile testing on LAN works seamlessly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers under /api
app.include_router(bags.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(phases.router, prefix="/api")
app.include_router(decisions.router, prefix="/api")
app.include_router(messages.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Divaaa's Bag Match API is glowing ✨👜"}


@app.get("/health")
def health():
    return {"status": "ok"}
