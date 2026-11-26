import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import StandingsTable from './components/StandingsTable';
import { useNotice } from './context/NoticeContext';
import { useTheme } from './context/ThemeContext';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import { useFetch } from './hooks/useFetch';
import { MAX_GOALS, RESULT_LABELS, ROUNDS } from './data';
import { calcMatchStats, calcStandings, getResult, getTeamName, isValidGoals } from './utils';

const BUILD_TAG = "bd-5918";

function App() {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [roundFilter, setRoundFilter] = useState('all');
  const { data, loading, error } = useFetch('/data/matches.json');

  useEffect(() => {
    if (Array.isArray(data)) dispatch(setMatches(data));
  }, [data, dispatch]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const selectedMatches = useMemo(() => roundFilter === 'all'
    ? matches
    : matches.filter((match) => match.round === Number(roundFilter)), [matches, roundFilter]);
  const stats = useMemo(() => calcMatchStats(selectedMatches), [selectedMatches]);
  const leader = standings[0];

  const handleGoalsChange = (match, side, event) => {
    const goals = event.currentTarget.valueAsNumber;
    if (!isValidGoals(goals)) return;
    dispatch(setGoals({
      id: match.id,
      homeGoals: side === 'home' ? goals : match.homeGoals,
      awayGoals: side === 'away' ? goals : match.awayGoals,
    }));
  };

  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  };

  const renderMatchRows = () => selectedMatches.map((match) => {
    const result = getResult(match);
    const homeName = getTeamName(match.home);
    const awayName = getTeamName(match.away);
    return (
      <tr className={result === 'draw' ? 'match-row match-row--draw' : 'match-row'} key={match.id}>
        <td className="match-round" data-label="Vòng">{match.round}</td>
        <td className="match-team match-team--home" data-label="Đội nhà">{homeName}</td>
        <td className="match-score" data-label="Bàn thắng nhà">
          <label className="visually-hidden" htmlFor={`home-score-${match.id}`}>Bàn thắng nhà {homeName} - {awayName}</label>
          <input id={`home-score-${match.id}`} type="number" min="0" max={MAX_GOALS} value={match.homeGoals} onChange={(event) => handleGoalsChange(match, 'home', event)} />
        </td>
        <td className="match-score match-score--away" data-label="Bàn thắng khách">
          <label className="visually-hidden" htmlFor={`away-score-${match.id}`}>Bàn thắng khách {homeName} - {awayName}</label>
          <input id={`away-score-${match.id}`} type="number" min="0" max={MAX_GOALS} value={match.awayGoals} onChange={(event) => handleGoalsChange(match, 'away', event)} />
        </td>
        <td className="match-team match-team--away" data-label="Đội khách">{awayName}</td>
        <td className="match-result" data-label="Kết quả">{RESULT_LABELS[result]}</td>
        <td className="match-action" data-label="Thao tác">
          <button className="remove-button" type="button" onClick={() => handleRemove(match)} aria-label={`Xóa trận ${homeName} - ${awayName}`}>Xóa</button>
        </td>
      </tr>
    );
  });

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <a className="skip-link" href="#main-content">Đến nội dung chính</a>
      <header className="topbar">
        <div className="container topbar__inner">
          <a className="wordmark" href="#main-content" aria-label="Giải bóng đá khoa, trang chính">Giải bóng đá khoa</a>
          <nav className="topnav" aria-label="Điều hướng trang">
            <a href="#fixtures">Lịch thi đấu</a>
            <a href="#standings">Bảng xếp hạng</a>
            <a href="#statistics">Thống kê</a>
          </nav>
        </div>
      </header>

      <main className="container page" id="main-content">
        <section className="page-heading" aria-labelledby="page-title">
          <div>
            <h1 id="page-title">Giải bóng đá khoa</h1>
            <p className="page-heading__summary">Lịch thi đấu, tỷ số và thứ hạng của sáu đội bóng.</p>
            <button className="button button--quiet theme-toggle" type="button" onClick={toggleTheme}>
              {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
            </button>
          </div>
          <a className="button button--primary" href="#add-match">Thêm trận</a>
        </section>

        <section className="stats-section" id="statistics" aria-labelledby="statistics-title">
          <h2 className="visually-hidden" id="statistics-title">Thống kê giải đấu</h2>
          <dl className="stats-grid" aria-live="polite">
            <div className="stat"><dt>Số trận</dt><dd className="stat__value">{stats.count}</dd></div>
            <div className="stat"><dt>Tổng số bàn thắng</dt><dd className="stat__value">{stats.goals}</dd></div>
            <div className="stat"><dt>Bàn thắng mỗi trận</dt><dd className="stat__value">{stats.average.toFixed(2)}</dd></div>
            <div className="stat stat--leader">
              <dt>Đội dẫn đầu</dt>
              <dd className="stat__leader">{matches.length === 0 ? '—' : <>{leader.name}<span>{leader.points} điểm</span></>}</dd>
            </div>
          </dl>
        </section>

        <section className="section" id="fixtures" aria-labelledby="fixtures-title">
          <div className="section-heading">
            <div>
              <h2 id="fixtures-title">Lịch thi đấu</h2>
              <p>Nhập tỷ số trực tiếp trên từng trận.</p>
            </div>
            <div className="filter-control">
              <label htmlFor="round-filter">Xem vòng</label>
              <select id="round-filter" name="round" value={roundFilter} onChange={(event) => setRoundFilter(event.target.value)}>
                <option value="all">Tất cả</option>
                {ROUNDS.map((round) => <option key={round} value={round}>Vòng {round}</option>)}
              </select>
            </div>
          </div>

          {loading && <div className="loading-state" role="status"><span className="loading-state__line" aria-hidden="true" /><span>Đang tải lịch thi đấu...</span></div>}
          {error && <div className="error-state" role="alert"><p>Không tải được lịch thi đấu.</p><button className="button button--quiet" type="button" onClick={() => window.location.reload()}>Tải lại trang</button></div>}
          {!loading && !error && selectedMatches.length === 0 && <p className="empty-state">Chưa có trận đấu nào.</p>}
          {!loading && !error && selectedMatches.length > 0 && (
            <div className="table-scroll">
              <table className="fixtures-table">
                <caption className="visually-hidden">Lịch thi đấu và tỷ số</caption>
                <thead><tr><th scope="col">Vòng</th><th scope="col">Đội nhà</th><th scope="col">BT nhà</th><th scope="col">BT khách</th><th scope="col">Đội khách</th><th scope="col">Kết quả</th><th scope="col"><span className="visually-hidden">Thao tác</span></th></tr></thead>
                <tbody>{renderMatchRows()}</tbody>
              </table>
            </div>
          )}
        </section>

        <StandingsTable standings={standings} />
        <GoalPlanner standings={standings} />
        <AddMatchForm />
        <footer className="page-footer"><span>Giải bóng đá khoa</span><span>6 đội bóng, 5 vòng đấu</span></footer>
      </main>
    </div>
  );
}

export default App;
