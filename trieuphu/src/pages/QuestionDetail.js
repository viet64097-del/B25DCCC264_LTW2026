import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS, LEVELS } from '../data';

export const QuestionDetail = ({ questions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionId = Number(id);
  const question = questions.find((item) => item.id === questionId);

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p role="alert">Không tải được câu hỏi.</p>;
  }

  if (!question) {
    return (
      <section>
        <p>Không tìm thấy câu hỏi.</p>
        <button className="button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </section>
    );
  }

  return (
    <section>
      <h1>
        Câu hỏi số {question.id} ({LEVELS[question.level]})
      </h1>
      <p className="detail-question">{question.question}</p>

      <ol className="answer-list">
        {question.options.map((option, index) => (
          <li
            className={index === question.answer ? 'correct-answer' : ''}
            key={`${question.id}-${index}`}
          >
            {LETTERS[index]}. {option}
            {index === question.answer && (
              <strong className="correct-label">Đáp án đúng</strong>
            )}
          </li>
        ))}
      </ol>

      <button className="button" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </section>
  );
};
