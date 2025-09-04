import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ResultSummary from "../components/ResultSummary";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state || {};
  const { questions = [], lockedSelections = [], score = 0, total = 0, timeMs = 0 } = data;

  if (!questions.length) {
    return (
      <div className="card">
        <div>No results to show. <Link to="/">Start a quiz</Link></div>
      </div>
    );
  }

  const seconds = Math.floor(Math.max(0, Math.round(timeMs / 1000)));
  const minutes = Math.floor(seconds / 60);
  const rem = seconds % 60;
  const timeFmt = `${minutes}:${String(rem).padStart(2, "0")}`;

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0 }}>You scored {score}/{total}</h2>
            <div className="small">Time: {timeFmt}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={() => navigate("/", { replace: true })}>Restart Quiz</button>
            <Link to="/highscores" className="btn btn-outline">High Scores</Link>
          </div>
        </div>
      </div>

      <div className="summary-list">
        {questions.map((q, i) => (
          <ResultSummary key={q.id || i} q={q} userIndex={lockedSelections[i] ?? -1} />
        ))}
      </div>
    </div>
  );
}
