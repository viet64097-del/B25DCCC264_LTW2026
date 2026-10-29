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
