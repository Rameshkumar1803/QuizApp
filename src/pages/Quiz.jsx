import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import ProgressBar from "../components/ProgressBar";
import Timer from "../components/Timer";
import { shuffle, decodeHtml } from "../utils";

const HS_KEY = "quiz_highscores_v1";

function saveHighScore(entry) {
  const list = JSON.parse(localStorage.getItem(HS_KEY) || "[]");
  list.push(entry);
  localStorage.setItem(HS_KEY, JSON.stringify(list.slice(-50)));
}

export default function Quiz() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const amount = Math.max(5, Math.min(10, Number(params.get("amount") || 10)));
  const useApi = params.get("useApi") !== "false";
  const difficulty = params.get("difficulty") || "mixed";
  const category = params.get("category") || "any";

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [lockedSelections, setLockedSelections] = useState([]); // store selected idxs
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // load questions
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        if (useApi) {
          const apiParams = new URLSearchParams();
          apiParams.set("amount", String(amount));
          apiParams.set("type", "multiple");
          if (["easy", "medium", "hard"].includes(difficulty)) apiParams.set("difficulty", difficulty);
          if (category !== "any") apiParams.set("category", category);
          const res = await fetch(`https://opentdb.com/api.php?${apiParams.toString()}`);
          const data = await res.json();
          if (!active) return;
          if (data && Array.isArray(data.results) && data.results.length >= 1 && data.response_code === 0) {
            const normalized = data.results.map((r, idx) => {
              const answers = shuffle([r.correct_answer, ...r.incorrect_answers]).map(decodeHtml);
              const correctIndex = answers.findIndex(a => a === decodeHtml(r.correct_answer));
              return {
                id: `api-${idx}-${Date.now()}`,
                category: r.category,
                difficulty: r.difficulty,
                question: decodeHtml(r.question),
                options: answers,
                correctIndex
              };
            }).slice(0, amount);
            setQuestions(normalized);
          } else {
            // fallback to local
            const resLocal = await fetch("/questions.json");
            const local = await resLocal.json();
            setQuestions(shuffle(local).slice(0, amount));
          }
        } else {
          const resLocal = await fetch("/questions.json");
          const local = await resLocal.json();
          setQuestions(shuffle(local).slice(0, amount));
        }
      } catch (e) {
        // network error -> fallback
        try {
          const resLocal = await fetch("/questions.json");
          const local = await resLocal.json();
          setQuestions(shuffle(local).slice(0, amount));
        } catch (err) {
          setQuestions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
          setIndex(0);
          setSelectedIndex(null);
          setLockedSelections([]);
          setTimeLeft(30);
          startTimeRef.current = Date.now();
        }
      }
    }
    load();
    return () => { active = false; };
  }, [amount, useApi, difficulty, category]);

  // timer logic for current question
  useEffect(() => {
    if (questions.length === 0) return;
    clearInterval(timerRef.current);
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // auto lock (if no selection it's recorded as -1)
          handleLock();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [index, questions.length]);

  // keyboard nav
  useEffect(() => {
    function onKey(e) {
      if (!questions.length) return;
      const current = questions[index];
      if (!current) return;
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => {
          const max = current.options.length - 1;
          if (prev === null) return 0;
          if (e.key === "ArrowUp") return Math.max(0, prev - 1);
          return Math.min(max, prev + 1);
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex !== null) handleLock();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [questions, index, selectedIndex]); // depends on selected

  const progress = Math.round(((lockedSelections.length) / questions.length) * 100);

  const handleLock = useCallback(() => {
    if (!questions[index]) return;
    // record (allow -1 => no selection)
    const sel = selectedIndex === null ? -1 : selectedIndex;
    const newLocked = [...lockedSelections, sel];
    setLockedSelections(newLocked);
    // move next or finish
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelectedIndex(null);
    } else {
      // compute score
      const correct = newLocked.reduce((acc, s, i) => {
        return acc + (s === questions[i].correctIndex ? 1 : 0);
      }, 0);
      const timeMs = Date.now() - startTimeRef.current;
      // persist highscore
      saveHighScore({ date: new Date().toISOString(), score: correct, total: questions.length, timeMs, settings: { amount: questions.length, difficulty, useApi, category } });
      // navigate to results with state
      navigate("/results", { state: { questions, lockedSelections: newLocked, score: correct, total: questions.length, timeMs } });
    }
  }, [index, selectedIndex, lockedSelections, questions, navigate, difficulty, useApi, category, amount]);

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setSelectedIndex(null);
    }
  };

  if (loading) {
    return <div className="card">Loading questions…</div>;
  }

  if (!questions.length) {
    return <div className="card">No questions available. Try going back to <a className="link" href="/">Start</a>.</div>;
  }

  const current = questions[index];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div className="small">Question {index + 1} of {questions.length}</div>
        <div className="small">Time left: <Timer secondsLeft={timeLeft} /></div>
      </div>

      <ProgressBar value={progress} />

      <div style={{ marginTop: 12 }} className="card">
        <QuestionCard question={current} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />

        <div className="controls">
          <div className="left">
            <button className="btn btn-outline" onClick={handlePrev} disabled={index === 0}>Previous</button>
            <button className="btn btn-outline" onClick={() => navigate("/")} >Quit</button>
          </div>

          <div>
            <button className="btn btn-primary" onClick={handleLock} disabled={selectedIndex === null && timeLeft > 0}> {index + 1 === questions.length ? "Finish" : "Next"} </button>
          </div>
        </div>
      </div>

      <div className="footer-note">
        Keyboard navigation: <kbd>↑</kbd>/<kbd>↓</kbd> to select, <kbd>Enter</kbd> to lock.
      </div>
    </div>
  );
}
