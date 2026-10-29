import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { MoneyLadder } from '../components/MoneyLadder';
import { QuestionCard } from '../components/QuestionCard';
import { Timer } from '../components/Timer';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';

export const Play = ({ questions, loading, error, playerName }) => {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [seconds, setSeconds] = useState(TIME_PER_QUESTION);
  const [status, setStatus] = useState('answering');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const question = questions[questionIndex];

  const finishGame = useCallback(
    (reason, correctCount) => {
      navigate('/result', {
        replace: true,
        state: {
          name: playerName,
          correctCount,
          prize: calcPrize(correctCount, reason),
          reason,
        },
      });
    },
    [navigate, playerName],
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
        setStatus('answering');
      }, 2000);

      return () => clearTimeout(nextStepId);
    }

    return undefined;
  }, [finishGame, question, questionIndex, questions.length, selectedAnswer, status]);

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

  const handleAnswer = (answerIndex) => {
    if (status !== 'answering') return;
    setSelectedAnswer(answerIndex);
    setStatus('locked');
  };

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
        <QuestionCard
          question={question}
          questionNumber={questionIndex + 1}
          status={status}
          selectedAnswer={selectedAnswer}
          onChoose={handleAnswer}
        />
        <MoneyLadder currentQuestion={questionIndex + 1} />
      </div>
    </section>
  );
};
