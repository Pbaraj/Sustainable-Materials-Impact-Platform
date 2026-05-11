from pydantic import BaseModel, Field
from typing import List


class MaterialInput(BaseModel):
    material_name: str = Field(..., example="concrete")
    quantity_kg: float = Field(..., gt=0, example=1000)


class CalculationRequest(BaseModel):
    project_name: str = Field(..., example="School Building Material Assessment")
    location: str = Field(default="Germany", example="Germany")
    materials: List[MaterialInput]


class MaterialImpactResult(BaseModel):
    material_name: str
    quantity_kg: float
    emission_factor_kgco2e_per_kg: float
    total_kgco2e: float
    formula: str
    interpretation: str


class CalculationResponse(BaseModel):
    project_name: str
    location: str
    total_kgco2e: float
    sustainability_score: float
    impact_level: str
    calculated_at_utc: str
    results: List[MaterialImpactResult]