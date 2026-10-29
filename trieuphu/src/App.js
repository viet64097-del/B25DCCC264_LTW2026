const BUILD_TAG = "tp-4186";

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { Result } from './pages/Result';
import { QuestionBank } from './pages/QuestionBank';
import { QuestionDetail } from './pages/QuestionDetail';
import { History } from './pages/History';
import { NotFound } from './pages/NotFound';
import './App.css';

const HISTORY_KEY = 'ltw_trieuphu_history';

const App = () => {
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(savedHistory) ? savedHistory : [];
    } catch {
      return [];
    }
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const saveFinishedGame = useCallback((result) => {
    const record = {
      id: Date.now(),
      ...result,
      playedAt: new Date().toLocaleString('vi-VN'),
    };
    setHistory((currentHistory) => [record, ...currentHistory]);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Keep the game usable if browser storage is unavailable.
    }
  }, [history]);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuestions = async () => {
      try {
        const response = await axios.get('/data/questions.json', {
          signal: controller.signal,
        });
        setQuestions(response.data);
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => controller.abort();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              onStart={() => navigate('/play')}
              history={history}
            />
          }
        />
        <Route
          path="play"
          element={
            playerName.trim() ? (
              <Play
                questions={questions}
                loading={loading}
                error={error}
                playerName={playerName}
                onGameFinished={saveFinishedGame}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={<History history={history} setHistory={setHistory} />}
        />
        <Route
          path="questions"
          element={
            <QuestionBank
              questions={questions}
              loading={loading}
              error={error}
            />
          }
        />
        <Route
          path="questions/:id"
          element={
            <QuestionDetail
              questions={questions}
              loading={loading}
              error={error}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
