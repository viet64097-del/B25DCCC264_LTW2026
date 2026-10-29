import { MILESTONES, PRIZES } from './data';

export const calcPrize = (correctCount, reason) => {
  if (reason === 'won') {
    return PRIZES[PRIZES.length - 1];
  }

  if (reason === 'stop') {
    return PRIZES[correctCount - 1] || 0;
  }

  const passedMilestones = MILESTONES.filter(
    (milestone) => milestone <= correctCount,
  );
  const highestMilestone = passedMilestones[passedMilestones.length - 1];

  return highestMilestone ? PRIZES[highestMilestone - 1] : 0;
};

export const makeAudiencePercentages = (correctAnswer, hiddenAnswers = []) => {
  const percentages = [0, 0, 0, 0];
  const visibleWrongAnswers = [0, 1, 2, 3].filter(
    (index) => index !== correctAnswer && !hiddenAnswers.includes(index),
  );
  const minimumCorrectPercentage =
    visibleWrongAnswers.length === 1 ? 51 : 40;
  const correctPercentage =
    Math.floor(Math.random() * (71 - minimumCorrectPercentage)) +
    minimumCorrectPercentage;
  percentages[correctAnswer] = correctPercentage;

  let remainingPercentage = 100 - correctPercentage;
  visibleWrongAnswers.forEach((index, position) => {
    if (position === visibleWrongAnswers.length - 1) {
      percentages[index] = remainingPercentage;
      return;
    }

    const remainingAnswers = visibleWrongAnswers.length - position - 1;
    const minimumPercentage = Math.max(
      0,
      remainingPercentage - remainingAnswers * correctPercentage,
    );
    const maximumPercentage = Math.min(
      remainingPercentage,
      correctPercentage,
    );
    const percentage =
      Math.floor(
        Math.random() * (maximumPercentage - minimumPercentage + 1),
      ) + minimumPercentage;
    percentages[index] = percentage;
    remainingPercentage -= percentage;
  });

  return percentages;
};
