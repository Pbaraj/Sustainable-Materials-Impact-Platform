from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from datetime import datetime, timezone
from app.database import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    total_kgco2e = Column(Float, nullable=False)
    sustainability_score = Column(Float, nullable=False)
    impact_level = Column(String(100), nullable=False)
    result_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))