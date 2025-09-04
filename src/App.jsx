import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import HighScores from './pages/HighScores';

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="container header-inner">
          <Link to="/" className="brand">QuizMaster</Link>
          <nav>
            <Link to="/highscores" className="nav-link">High Scores</Link>
            <a href="https://opentdb.com/api_config.php" target="_blank" rel="noreferrer" className="nav-link">Open Trivia DB</a>
          </nav>
        </div>
      </header>

      <main className="container main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/highscores" element={<HighScores />} />
          <Route path="*" element={<div>Page not found. <Link to="/">Go home</Link></div>} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container">Built with React • Accessible & responsive</div>
      </footer>
    </div>
  );
}
