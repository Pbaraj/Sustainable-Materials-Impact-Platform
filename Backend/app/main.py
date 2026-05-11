from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.impact import router as impact_router
from app.database import engine
from app import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sustainable Materials Impact API",
    description="A cloud-native backend for calculating simplified environmental impact of construction materials.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(impact_router)


@app.get("/")
def home():
    return {
        "message": "Sustainable Materials Impact API is running",
        "project": "Cloud Project 3"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }