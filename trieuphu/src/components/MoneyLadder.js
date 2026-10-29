import { MILESTONES, PRIZES, formatMoney } from '../data';

export const MoneyLadder = ({ currentQuestion }) => (
  <aside className="money-ladder">
    <h2>Bậc tiền thưởng</h2>
    <ol>
      {PRIZES.map((prize, index) => ({ prize, number: index + 1 }))
        .reverse()
        .map(({ prize, number }) => (
          <li
            className={[
              number === currentQuestion ? 'current-prize' : '',
              MILESTONES.includes(number) ? 'safe-prize' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={number}
          >
            <span>{number}.</span>
            <span>{formatMoney(prize)}</span>
          </li>
        ))}
    </ol>
  </aside>
);
