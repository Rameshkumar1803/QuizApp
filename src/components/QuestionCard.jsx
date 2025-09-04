import React from "react";

export default function QuestionCard({ question, selectedIndex, onSelect }) {
  return (
    <div className="fade-in">
      <div className="question-meta">
        {question.category} • {question.difficulty}
      </div>
      <div className="question-title">{question.question}</div>
      <div className="options">
        {question.options.map((opt, i) => (
          <div
            key={i}
            tabIndex={0} // makes it keyboard-focusable
            className={`option ${selectedIndex === i ? "selected" : ""}`}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => e.key === "Enter" && onSelect(i)}
          >
            <span className="dot" aria-hidden="true"></span>
            <span>{opt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
