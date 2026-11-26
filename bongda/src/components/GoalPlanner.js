import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGoal, setRemaining, setTarget, setTeamId } from '../features/goalSlice';
import { TEAMS } from '../data';
import { calcNeeded } from '../utils';

function GoalPlanner({ standings }) {
  const dispatch = useDispatch();
  const { teamId, target, remaining } = useSelector(selectGoal);
  const result = useMemo(() => calcNeeded(standings, teamId, target, remaining), [standings, teamId, target, remaining]);

  return (
    <section className="section goal-section" aria-labelledby="goal-title">
      <div className="section-heading">
        <div>
          <h2 id="goal-title">Mục tiêu điểm</h2>
          <p>Điểm hiện tại được tính từ toàn bộ lịch thi đấu.</p>
        </div>
      </div>
      <div className="goal-panel">
        <div className="goal-controls">
          <div className="form-field">
            <label htmlFor="goal-team">Đội của bạn</label>
            <select id="goal-team" value={teamId} onChange={(event) => dispatch(setTeamId(event.target.value))}>
              {TEAMS.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="goal-target">Số điểm mục tiêu</label>
            <input id="goal-target" type="number" min="0" value={target} onChange={(event) => dispatch(setTarget(event.target.value))} />
          </div>
          <div className="form-field">
            <label htmlFor="goal-remaining">Số trận còn lại</label>
            <input id="goal-remaining" type="number" min="1" value={remaining} onChange={(event) => dispatch(setRemaining(event.target.value))} />
          </div>
        </div>
        <p className="goal-result" aria-live="polite">{result}</p>
      </div>
    </section>
  );
}

export default GoalPlanner;
