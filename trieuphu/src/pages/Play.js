import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AudienceChart } from '../components/AudienceChart';
import { Lifelines } from '../components/Lifelines';
import { MoneyLadder } from '../components/MoneyLadder';
import { QuestionCard } from '../components/QuestionCard';
import { Timer } from '../components/Timer';
import { LETTERS, TIME_PER_QUESTION } from '../data';
import { calcPrize, makeAudiencePercentages } from '../utils';

export const Play = ({
  questions,
  loading,
  error,
  playerName,
  onGameFinished,
}) => {
  const navigate = useNavigate();
  const finishGuard = useRef(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [seconds, setSeconds] = useState(TIME_PER_QUESTION);
  const [status, setStatus] = useState('answering');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hiddenAnswers, setHiddenAnswers] = useState([]);
  const [usedLifelines, setUsedLifelines] = useState({
    fifty: false,
    audience: false,
  });
  const [audiencePercentages, setAudiencePercentages] = useState(null);
  const question = questions[questionIndex];

  const finishGame = useCallback(
    (reason, correctCount) => {
      if (finishGuard.current) return;
      finishGuard.current = true;

      const result = {
        name: playerName,
        correctCount,
        prize: calcPrize(correctCount, reason),
        reason,
      };

      onGameFinished(result);
      navigate('/result', { replace: true, state: result });
    },
    [navigate, onGameFinished, playerName],
  );

  useEffect(() => {
    if (status !== 'answering') return undefined;

    const intervalId = setInterval(() => {
      setSeconds((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status === 'answering' && seconds === 0) {
      finishGame('timeout', questionIndex);
    }
  }, [finishGame, questionIndex, seconds, status]);

  useEffect(() => {
    if (status === 'locked') {
      const revealId = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(revealId);
    }

    if (status === 'revealed' && question) {
      const isCorrect = selectedAnswer === question.answer;
      const nextStepId = setTimeout(() => {
        if (!isCorrect) {
          finishGame('wrong', questionIndex);
          return;
        }

        if (questionIndex === questions.length - 1) {
          finishGame('won', questions.length);
          return;
        }

        setQuestionIndex((currentIndex) => currentIndex + 1);
        setSeconds(TIME_PER_QUESTION);
        setSelectedAnswer(null);
        setHiddenAnswers([]);
        setAudiencePercentages(null);
        setStatus('answering');
      }, 2000);

      return () => clearTimeout(nextStepId);
    }

    return undefined;
  }, [finishGame, question, questionIndex, questions.length, selectedAnswer, status]);

  useEffect(() => {
    if (!question || loading || error) return undefined;

    document.title = `Câu ${questionIndex + 1}/15 – ${playerName}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [error, loading, playerName, question, questionIndex]);

  const handleAnswer = useCallback(
    (answerIndex) => {
      if (status !== 'answering' || hiddenAnswers.includes(answerIndex)) return;
      setSelectedAnswer(answerIndex);
      setStatus('locked');
    },
    [hiddenAnswers, status],
  );

  useEffect(() => {
    if (status !== 'answering') return undefined;

    const handleKey = (event) => {
      const answerIndex = LETTERS.indexOf(event.key.toUpperCase());
      if (answerIndex >= 0 && !hiddenAnswers.includes(answerIndex)) {
        event.preventDefault();
        handleAnswer(answerIndex);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleAnswer, hiddenAnswers, status]);

  const useFiftyFifty = () => {
    if (status !== 'answering' || usedLifelines.fifty || !question) return;

    const wrongAnswers = question.options
      .map((option, index) => index)
      .filter((index) => index !== question.answer);

    for (let index = wrongAnswers.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [wrongAnswers[index], wrongAnswers[randomIndex]] = [
        wrongAnswers[randomIndex],
        wrongAnswers[index],
      ];
    }

    setHiddenAnswers(wrongAnswers.slice(0, 2));
    setUsedLifelines((current) => ({ ...current, fifty: true }));
  };

  const askAudience = () => {
    if (status !== 'answering' || usedLifelines.audience || !question) return;

    setAudiencePercentages(
      makeAudiencePercentages(question.answer, hiddenAnswers),
    );
    setUsedLifelines((current) => ({ ...current, audience: true }));
  };

  if (!playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p role="alert">Không tải được câu hỏi.</p>;
  }

  if (!question) {
    return <p>Không có câu hỏi để chơi.</p>;
  }

  return (
    <section className="play-page">
      <div className="play-header">
        <div>
          <p className="section-label">Người chơi</p>
          <h1>{playerName}</h1>
        </div>
        <Timer seconds={seconds} />
      </div>

      <div className="play-layout">
        <div className="game-main">
          <QuestionCard
            question={question}
            questionNumber={questionIndex + 1}
            status={status}
            selectedAnswer={selectedAnswer}
            hiddenAnswers={hiddenAnswers}
            onChoose={handleAnswer}
          />
          <Lifelines
            used={usedLifelines}
            canUse={status === 'answering'}
            onUseFifty={useFiftyFifty}
            onUseAudience={askAudience}
            onStop={() => finishGame('stop', questionIndex)}
          />
          {audiencePercentages && (
            <AudienceChart percentages={audiencePercentages} />
          )}
        </div>
        <MoneyLadder currentQuestion={questionIndex + 1} />
      </div>
    </section>
  );
};
