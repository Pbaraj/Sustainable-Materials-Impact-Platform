from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.schemas import CalculationRequest, CalculationResponse
from app.calculations import calculate_material_impact, get_supported_materials
from app.database import SessionLocal
from app.models import Assessment
from app.cache import get_cached_value, set_cached_value, delete_cached_value

router = APIRouter(
    prefix="/impact",
    tags=["Material Impact"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/materials")
def supported_materials():
    return {
        "message": "Supported materials and emission factors",
        "materials": get_supported_materials()
    }


@router.post("/calculate", response_model=CalculationResponse)
def calculate_impact(
    request: CalculationRequest,
    db: Session = Depends(get_db)
):
    try:
        result = calculate_material_impact(request)

        assessment = Assessment(
            project_name=result["project_name"],
            location=result["location"],
            total_kgco2e=result["total_kgco2e"],
            sustainability_score=result["sustainability_score"],
            impact_level=result["impact_level"],
            result_data=result
        )

        db.add(assessment)
        db.commit()
        db.refresh(assessment)

        # Clear dashboard cache because new data was saved
        delete_cached_value("dashboard_summary")

        return result

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/assessments")
def get_assessments(db: Session = Depends(get_db)):
    assessments = db.query(Assessment).order_by(Assessment.created_at.desc()).all()

    return [
        {
            "id": assessment.id,
            "project_name": assessment.project_name,
            "location": assessment.location,
            "total_kgco2e": assessment.total_kgco2e,
            "sustainability_score": assessment.sustainability_score,
            "impact_level": assessment.impact_level,
            "created_at": assessment.created_at,
            "result_data": assessment.result_data
        }
        for assessment in assessments
    ]


@router.get("/dashboard-summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    cached_summary = get_cached_value("dashboard_summary")

    if cached_summary:
        cached_summary["source"] = "redis_cache"
        return cached_summary

    total_assessments = db.query(Assessment).count()

    average_score = db.query(
        func.avg(Assessment.sustainability_score)
    ).scalar()

    highest_impact = db.query(Assessment).order_by(
        Assessment.total_kgco2e.desc()
    ).first()

    latest_assessment = db.query(Assessment).order_by(
        Assessment.created_at.desc()
    ).first()

    summary = {
        "total_assessments": total_assessments,
        "average_sustainability_score": round(average_score or 0, 2),
        "highest_impact_project": highest_impact.project_name if highest_impact else None,
        "highest_impact_kgco2e": highest_impact.total_kgco2e if highest_impact else 0,
        "latest_project": latest_assessment.project_name if latest_assessment else None,
        "latest_impact_level": latest_assessment.impact_level if latest_assessment else None,
        "source": "postgresql_database"
    }

    set_cached_value("dashboard_summary", summary, expire_seconds=300)

    return summary