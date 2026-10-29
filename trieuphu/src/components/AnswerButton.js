import { LETTERS } from '../data';

export const AnswerButton = ({
  index,
  option,
  status,
  selectedAnswer,
  correctAnswer,
  hidden,
  onChoose,
}) => {
  let answerClass = '';

  if (status === 'locked' && selectedAnswer === index) {
    answerClass = 'answer-locked';
  }

  if (status === 'revealed' && index === correctAnswer) {
    answerClass = 'answer-correct';
  } else if (
    status === 'revealed' &&
    selectedAnswer === index &&
    index !== correctAnswer
  ) {
    answerClass = 'answer-wrong';
  }

  return (
    <button
      className={`game-answer ${answerClass}`}
      type="button"
      disabled={status !== 'answering' || hidden}
      onClick={() => onChoose(index)}
    >
      {hidden ? '' : `${LETTERS[index]}. ${option}`}
    </button>
  );
};
