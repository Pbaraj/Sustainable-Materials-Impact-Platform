import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type MaterialInput = {
  id: number;
  material_name: string;
  quantity_kg: number;
};

type MaterialImpactResult = {
  material_name: string;
  quantity_kg: number;
  emission_factor_kgco2e_per_kg: number;
  total_kgco2e: number;
  formula: string;
  interpretation: string;
};

type CalculationResponse = {
  project_name: string;
  location: string;
  total_kgco2e: number;
  sustainability_score: number;
  impact_level: string;
  calculated_at_utc: string;
  results: MaterialImpactResult[];
};

type SavedAssessment = {
  id: number;
  project_name: string;
  location: string;
  total_kgco2e: number;
  sustainability_score: number;
  impact_level: string;
  created_at: string;
  result_data: CalculationResponse;
};

const materialOptions = [
  "concrete",
  "steel",
  "timber",
  "brick",
  "glass",
  "insulation",
];

function App() {
  const [projectName, setProjectName] = useState(
    "School Building Material Assessment"
  );
  const [location, setLocation] = useState("Germany");

  const [materials, setMaterials] = useState<MaterialInput[]>([
    { id: 1, material_name: "concrete", quantity_kg: 5000 },
    { id: 2, material_name: "steel", quantity_kg: 800 },
    { id: 3, material_name: "timber", quantity_kg: 1200 },
  ]);

  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>(
    []
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchAssessments = async () => {
    setHistoryLoading(true);

    try {
      const response = await axios.get<SavedAssessment[]>(
        `${API_URL}/impact/assessments`
      );
      setSavedAssessments(response.data);
    } catch {
      setError("Could not load saved assessments from PostgreSQL.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const updateMaterial = (
    id: number,
    field: keyof MaterialInput,
    value: string | number
  ) => {
    setMaterials((currentMaterials) =>
      currentMaterials.map((material) =>
        material.id === id ? { ...material, [field]: value } : material
      )
    );
  };

  const addMaterial = () => {
    const newMaterial: MaterialInput = {
      id: Date.now(),
      material_name: "concrete",
      quantity_kg: 1000,
    };

    setMaterials([...materials, newMaterial]);
  };

  const removeMaterial = (id: number) => {
    if (materials.length === 1) {
      setError("At least one material is required.");
      return;
    }

    setMaterials(materials.filter((material) => material.id !== id));
  };

  const calculateImpact = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post<CalculationResponse>(
        `${API_URL}/impact/calculate`,
        {
          project_name: projectName,
          location,
          materials: materials.map((material) => ({
            material_name: material.material_name,
            quantity_kg: Number(material.quantity_kg),
          })),
        }
      );

      setResult(response.data);
      await fetchAssessments();
    } catch {
      setError(
        "Could not calculate impact. Please check if the FastAPI backend and PostgreSQL database are running."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAssessment = (assessment: SavedAssessment) => {
    setResult(assessment.result_data);
    setProjectName(assessment.project_name);
    setLocation(assessment.location);
  };

  const highestImpactMaterial =
    result?.results.reduce((highest, current) =>
      current.total_kgco2e > highest.total_kgco2e ? current : highest
    ) || null;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🌱</div>
          <div>
            <h2>Material Impact</h2>
            <p>Climate dashboard</p>
          </div>
        </div>

        <nav>
          <a className="active">Overview</a>
          <a>Calculator</a>
          <a>Saved Assessments</a>
          <a>Reports</a>
          <a>Settings</a>
        </nav>

        <div className="sidebar-card">
          <p>Project 3</p>
          <h3>Sustainable Materials Impact Platform</h3>
          <span>React · TypeScript · FastAPI · PostgreSQL</span>
        </div>
      </aside>

      <main className="dashboard">
        <section className="hero">
          <div>
            <p className="eyebrow">Cloud-native sustainability tool</p>
            <h1>Sustainable Materials Impact Platform</h1>
            <p>
              Estimate embodied carbon for construction materials using
              traceable calculation logic, PostgreSQL storage, and a modern
              full-stack architecture.
            </p>
          </div>

          <div className="hero-metric">
            <span>Current Stack</span>
            <strong>FastAPI + PostgreSQL</strong>
            <small>{API_URL}</small>
          </div>
        </section>

        <section className="summary-grid">
          <div className="summary-card">
            <span>Total CO₂e</span>
            <h2>{result ? `${result.total_kgco2e} kg` : "—"}</h2>
            <p>Estimated embodied carbon</p>
          </div>

          <div className="summary-card">
            <span>Score</span>
            <h2>{result ? `${result.sustainability_score}/100` : "—"}</h2>
            <p>Simplified sustainability score</p>
          </div>

          <div className="summary-card">
            <span>Impact Level</span>
            <h2>{result ? result.impact_level : "—"}</h2>
            <p>Based on total CO₂e estimate</p>
          </div>

          <div className="summary-card">
            <span>Saved Assessments</span>
            <h2>{savedAssessments.length}</h2>
            <p>Stored in PostgreSQL</p>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel calculator-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Assessment input</p>
                <h2>Material Calculator</h2>
              </div>
              <button onClick={addMaterial}>+ Add Material</button>
            </div>

            <div className="project-fields">
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Project name"
              />

              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
              />
            </div>

            <div className="materials-list">
              {materials.map((material) => (
                <div className="material-row" key={material.id}>
                  <select
                    value={material.material_name}
                    onChange={(event) =>
                      updateMaterial(
                        material.id,
                        "material_name",
                        event.target.value
                      )
                    }
                  >
                    {materialOptions.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={material.quantity_kg}
                    onChange={(event) =>
                      updateMaterial(
                        material.id,
                        "quantity_kg",
                        Number(event.target.value)
                      )
                    }
                    min="1"
                  />

                  <span>kg</span>

                  <button
                    className="ghost-button"
                    onClick={() => removeMaterial(material.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {error && <div className="error-box">{error}</div>}

            <button className="calculate-button" onClick={calculateImpact}>
              {loading ? "Calculating..." : "Calculate & Save Assessment"}
            </button>
          </div>

          <div className="panel chart-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Impact comparison</p>
                <h2>Material CO₂e Breakdown</h2>
              </div>
            </div>

            {result ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={result.results}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="material_name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_kgco2e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="driver-box">
                  <span>Main impact driver</span>
                  <strong>
                    {highestImpactMaterial
                      ? `${highestImpactMaterial.material_name} – ${highestImpactMaterial.total_kgco2e} kg CO₂e`
                      : "—"}
                  </strong>
                </div>
              </>
            ) : (
              <div className="empty-chart">
                Run a calculation to see the material impact chart.
              </div>
            )}
          </div>
        </section>

        <section className="panel saved-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">PostgreSQL history</p>
              <h2>Saved Assessments</h2>
            </div>
            <button className="ghost-button" onClick={fetchAssessments}>
              {historyLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {savedAssessments.length > 0 ? (
            <div className="assessment-grid">
              {savedAssessments.slice(0, 6).map((assessment) => (
                <div className="assessment-card" key={assessment.id}>
                  <div>
                    <span>{assessment.location}</span>
                    <h3>{assessment.project_name}</h3>
                  </div>

                  <div className="assessment-metrics">
                    <p>
                      <strong>{assessment.total_kgco2e}</strong> kg CO₂e
                    </p>
                    <p>
                      <strong>{assessment.sustainability_score}</strong>/100
                    </p>
                  </div>

                  <div className="assessment-footer">
                    <span>{assessment.impact_level}</span>
                    <button onClick={() => loadAssessment(assessment)}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">
              No saved assessments yet. Run a calculation to store one in
              PostgreSQL.
            </p>
          )}
        </section>

        <section className="panel trace-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Audit-friendly output</p>
              <h2>Calculation Traceability</h2>
            </div>
          </div>

          {result ? (
            <div className="trace-table">
              <div className="trace-row trace-head">
                <span>Material</span>
                <span>Quantity</span>
                <span>Factor</span>
                <span>Total CO₂e</span>
                <span>Formula</span>
              </div>

              {result.results.map((item) => (
                <div className="trace-row" key={item.material_name}>
                  <span>{item.material_name}</span>
                  <span>{item.quantity_kg} kg</span>
                  <span>{item.emission_factor_kgco2e_per_kg}</span>
                  <span>{item.total_kgco2e} kg</span>
                  <span>{item.formula}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">
              Calculation breakdown will appear here after running the
              assessment.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;