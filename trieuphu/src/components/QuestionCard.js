import { AnswerButton } from './AnswerButton';

export const QuestionCard = ({
  question,
  questionNumber,
  status,
  selectedAnswer,
  onChoose,
}) => (
  <section className="question-card">
    <p className="section-label">Câu {questionNumber} / 15</p>
    <h1 className="game-question">{question.question}</h1>
    <div className="game-answers">
      {question.options.map((option, index) => (
        <AnswerButton
          key={`${question.id}-${index}`}
          index={index}
          option={option}
          status={status}
          selectedAnswer={selectedAnswer}
          correctAnswer={question.answer}
          onChoose={onChoose}
        />
      ))}
    </div>
  </section>
);
