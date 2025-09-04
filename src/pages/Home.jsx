import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [useApi, setUseApi] = useState(true);
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState("mixed");
  const [category, setCategory] = useState("any");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadCats() {
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        const data = await res.json();
        if (!active) return;
        setCategories(data.trivia_categories || []);
      } catch (e) {
        // ignore, optional
      }
    }
    loadCats();
    return () => { active = false; };
  }, []);

  const start = () => {
    const params = new URLSearchParams();
    params.set("amount", amount);
    params.set("useApi", String(useApi));
    if (difficulty !== "mixed") params.set("difficulty", difficulty);
    if (category !== "any") params.set("category", category);
    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <div className="grid-2">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Welcome to QuizMaster</h1>
        <p className="small">Choose your settings & start the quiz. Use keyboard ↑/↓ to move selection, Enter to confirm.</p>

        <div style={{ marginTop: 14 }}>
          <div style={{ marginBottom: 10 }}>
            <label className="small">Question source</label>
            <div style={{ marginTop: 8 }}>
              <label style={{ marginRight: 12 }}>
                <input type="radio" name="source" checked={useApi} onChange={() => setUseApi(true)} /> API (Open Trivia DB)
              </label>
              <label>
                <input type="radio" name="source" checked={!useApi} onChange={() => setUseApi(false)} /> Local fallback
              </label>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="small">Number of questions: {amount}</label>
            <input type="range" min="5" max="10" value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: "100%" }} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="small">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }}>
              <option value="mixed">Mixed</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="small">Category (optional)</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }}>
              <option value="any">Any</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={start}>Start Quiz</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>What you get</h2>
        <ul style={{ marginTop: 8, color: "var(--muted)" }}>
          <li>One question at a time with 4 choices</li>
          <li>Timer per question (30s) with auto-lock</li>
          <li>Progress + result breakdown</li>
          <li>Persistent high scores</li>
          <li>Accessible and responsive</li>
        </ul>

        <div className="footer-note">
          Tip: Press <kbd>↑</kbd> / <kbd>↓</kbd> to move selection, <kbd>Enter</kbd> to lock answer.
        </div>
      </div>
    </div>
  );
}
