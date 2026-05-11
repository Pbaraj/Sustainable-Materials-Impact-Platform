from datetime import datetime, timezone


EMISSION_FACTORS = {
    "concrete": {
        "factor": 0.12,
        "description": "Typical ready-mix concrete estimate"
    },
    "steel": {
        "factor": 1.85,
        "description": "Structural steel estimate"
    },
    "timber": {
        "factor": 0.20,
        "description": "Generic timber product estimate"
    },
    "brick": {
        "factor": 0.22,
        "description": "Clay brick estimate"
    },
    "glass": {
        "factor": 0.85,
        "description": "Flat glass estimate"
    },
    "insulation": {
        "factor": 2.50,
        "description": "Generic insulation material estimate"
    }
}


def get_supported_materials():
    return EMISSION_FACTORS


def classify_impact(total_kgco2e: float) -> str:
    if total_kgco2e < 500:
        return "Low Impact"
    elif total_kgco2e < 2500:
        return "Medium Impact"
    elif total_kgco2e < 7500:
        return "High Impact"
    return "Very High Impact"


def calculate_sustainability_score(total_kgco2e: float) -> float:
    score = 100 - (total_kgco2e / 100)
    return round(max(score, 0), 2)


def calculate_material_impact(request):
    results = []
    total_impact = 0

    for item in request.materials:
        material_key = item.material_name.lower().strip()

        if material_key not in EMISSION_FACTORS:
            raise ValueError(f"Material '{item.material_name}' is not supported yet.")

        factor = EMISSION_FACTORS[material_key]["factor"]
        impact = item.quantity_kg * factor
        total_impact += impact

        if impact < 500:
            interpretation = "This material has a relatively low contribution in this assessment."
        elif impact < 2500:
            interpretation = "This material has a moderate contribution and may be optimized."
        else:
            interpretation = "This material is a major impact driver and should be reviewed carefully."

        results.append({
            "material_name": material_key,
            "quantity_kg": item.quantity_kg,
            "emission_factor_kgco2e_per_kg": factor,
            "total_kgco2e": round(impact, 2),
            "formula": f"{item.quantity_kg} kg × {factor} kg CO2e/kg = {round(impact, 2)} kg CO2e",
            "interpretation": interpretation
        })

    return {
        "project_name": request.project_name,
        "location": request.location,
        "total_kgco2e": round(total_impact, 2),
        "sustainability_score": calculate_sustainability_score(total_impact),
        "impact_level": classify_impact(total_impact),
        "calculated_at_utc": datetime.now(timezone.utc).isoformat(),
        "results": results
    }