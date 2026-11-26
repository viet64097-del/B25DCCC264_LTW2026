import { memo, useRef } from 'react';
import { MAX_GOALS, RESULT_LABELS } from '../data';
import { getResult, getTeamName } from '../utils';

function MatchRow({ match, onGoals, onRemove }) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const result = getResult(match);
  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);

  return (
    <tr className={result === 'draw' ? 'match-row match-row--draw' : 'match-row'}>
      <td className="match-round" data-label="Vòng">{match.round}</td>
      <td className="match-team match-team--home" data-label="Đội nhà">{homeName}</td>
      <td className="match-score" data-label="Bàn thắng nhà">
        <label className="visually-hidden" htmlFor={`home-score-${match.id}`}>Bàn thắng nhà {homeName} - {awayName}</label>
        <input id={`home-score-${match.id}`} type="number" min="0" max={MAX_GOALS} value={match.homeGoals} onChange={(event) => onGoals(match, 'home', event)} />
      </td>
      <td className="match-score match-score--away" data-label="Bàn thắng khách">
        <label className="visually-hidden" htmlFor={`away-score-${match.id}`}>Bàn thắng khách {homeName} - {awayName}</label>
        <input id={`away-score-${match.id}`} type="number" min="0" max={MAX_GOALS} value={match.awayGoals} onChange={(event) => onGoals(match, 'away', event)} />
      </td>
      <td className="match-team match-team--away" data-label="Đội khách">{awayName}</td>
      <td className="match-result" data-label="Kết quả">{RESULT_LABELS[result]}</td>
      <td className="match-render-count" data-label="Số lần render">{renderCount.current}</td>
      <td className="match-action" data-label="Thao tác">
        <button className="remove-button" type="button" onClick={() => onRemove(match)} aria-label={`Xóa trận ${homeName} - ${awayName}`}>Xóa</button>
      </td>
    </tr>
  );
}

export default memo(MatchRow);
