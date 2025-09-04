import React from "react";

export default function ProgressBar({ value = 0 }) {
  return (
    <div className="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}>
      <i style={{ width: `${value}%` }} />
    </div>
  );
}
