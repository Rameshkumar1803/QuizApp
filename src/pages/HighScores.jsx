import React from "react";

const HS_KEY = "quiz_highscores_v1";

function fmtTime(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function HighScores() {
  const list = JSON.parse(localStorage.getItem(HS_KEY) || "[]");
  const sorted = [...list].sort((a, b) => (b.score - a.score) || (a.timeMs - b.timeMs));

  if (!sorted.length) {
    return <div className="card">No high scores yet. Play a quiz to save your score!</div>;
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>High Scores</h2>
      <div style={{ overflowX: "auto", marginTop: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ textAlign: "left", color: "var(--muted)" }}>
            <tr>
              <th>#</th>
              <th>Score</th>
              <th>Time</th>
              <th>When</th>
              <th>Settings</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={i} style={{ borderTop: "1px solid #eef2f7" }}>
                <td style={{ padding: 8 }}>{i + 1}</td>
                <td style={{ padding: 8, fontWeight: 700 }}>{s.score}/{s.total}</td>
                <td style={{ padding: 8 }}>{fmtTime(s.timeMs)}</td>
                <td style={{ padding: 8 }}>{new Date(s.date).toLocaleString()}</td>
                <td style={{ padding: 8, color: "var(--muted)" }}>{s.settings?.amount} Q • {s.settings?.difficulty} {s.settings?.useApi ? "• API" : "• Local"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
