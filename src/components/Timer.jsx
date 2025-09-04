import React from "react";

export default function Timer({ secondsLeft }) {
  return <div className="timer" aria-live="polite">{secondsLeft}s</div>;
}
