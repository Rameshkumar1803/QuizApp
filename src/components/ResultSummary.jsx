import React from "react";

export default function ResultSummary({ q, userIndex }) {
  const correctIndex = q.correctIndex;
  const isCorrect = userIndex === correctIndex;
  return (
    <div className="card" role="article" aria-label="question summary">
      <div className="question-meta">{q.category} • {q.difficulty}</div>
      <div style={{ fontWeight: 600 }}>{q.question}</div>

      <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
        <div><strong>Your answer:</strong> {userIndex >= 0 ? q.options[userIndex] : <em style={{ color: "#6b7280" }}>(no answer)</em>}</div>
        <div><strong>Correct:</strong> {q.options[correctIndex]}</div>
      </div>

      <div style={{ marginTop: 10 }}>
        <span className={`result-pill ${isCorrect ? "correct" : "wrong"}`}>{isCorrect ? "Correct" : "Incorrect"}</span>
      </div>
    </div>
  );
}
