import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.rides import router as rides_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(name)s  %(levelname)s  %(message)s")

app = FastAPI(
    title="Desert Path Mobility — NEMT API",
    version="1.0.0",
    description="Non-Emergency Medical Transportation ride management API",
)

# CORS — allow all origins during MVP; tighten for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rides_router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
