import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import MatchRow from './components/MatchRow';
import StandingsTable from './components/StandingsTable';
import { useNotice } from './context/NoticeContext';
import { useTheme } from './context/ThemeContext';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import { useDebounce } from './hooks/useDebounce';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { hasSaved } from './store';
import { RESULT_LABELS, ROUNDS } from './data';
import { calcMatchStats, calcStandings, getTeamName, isValidGoals } from './utils';

const BUILD_TAG = "bd-5918";

function App() {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [roundFilter, setRoundFilter] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);
  const { data, loading, error } = useFetch('/data/matches.json');

  useEffect(() => {
    if (!hasSaved || !Array.isArray(data)) return;
    dispatch(setMatches(data));
  }, [data, dispatch]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const selectedMatches = useMemo(() => roundFilter === 'all'
    ? matches
    : matches.filter((match) => match.round === Number(roundFilter)), [matches, roundFilter]);
  const stats = useMemo(() => calcMatchStats(selectedMatches), [selectedMatches]);
  const normalizedSearch = debouncedSearch.trim().toLocaleLowerCase('vi');
  const visibleMatches = useMemo(() => {
    if (!normalizedSearch) return selectedMatches;
    return selectedMatches.filter((match) =>
      `${getTeamName(match.home)} ${getTeamName(match.away)}`.toLocaleLowerCase('vi').includes(normalizedSearch));
  }, [normalizedSearch, selectedMatches]);
  const leader = standings[0];

  const handleGoalsChange = useCallback((match, side, event) => {
    const goals = event.currentTarget.valueAsNumber;
    if (!isValidGoals(goals)) return;
    dispatch(setGoals({
      id: match.id,
      homeGoals: side === 'home' ? goals : match.homeGoals,
      awayGoals: side === 'away' ? goals : match.awayGoals,
    }));
  }, [dispatch]);

  const handleRemove = useCallback((match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  }, [dispatch, showNotice]);

  const handleTeamShift = (event) => setSearch(event.currentTarget.value);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const active = document.activeElement;
      const isTyping = active?.isContentEditable || active?.matches('input, select, textarea, [contenteditable="true"]');
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      } else if (event.key === 'Escape' && active === searchRef.current) {
        setSearch('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.title = matches.length === 0
      ? 'Giải bóng đá khoa'
      : `${leader.name} dẫn đầu \u2013 Giải bóng đá khoa`;
  }, [leader.name, matches.length]);

  const showSampleLoading = hasSaved && loading;
  const showSampleError = hasSaved && error;
  const canResetSample = Array.isArray(data);

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
          <div className="result-distribution" aria-label="Phân bố kết quả trong vòng đang chọn">
            <h3>Phân bố kết quả</h3>
            <ul>
              {Object.entries(RESULT_LABELS).map(([key, label]) => (
                <li key={key}>
                  <span>{label}: {stats.counts[key]}</span>
                  <span className="result-bar" aria-hidden="true"><span style={{ width: `${24 * stats.counts[key]}px` }} /></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="fixtures" aria-labelledby="fixtures-title">
          <div className="section-heading">
            <div>
              <h2 id="fixtures-title">Lịch thi đấu</h2>
              <p>Nhập tỷ số trực tiếp trên từng trận.</p>
            </div>
            <div className="fixture-controls">
              <div className="filter-control">
                <label htmlFor="round-filter">Xem vòng</label>
                <select id="round-filter" name="round" value={roundFilter} onChange={(event) => setRoundFilter(event.target.value)}>
                  <option value="all">Tất cả</option>
                  {ROUNDS.map((round) => <option key={round} value={round}>Vòng {round}</option>)}
                </select>
              </div>
              <div className="search-control">
                <label htmlFor="team-search">Tìm đội <span aria-hidden="true">/</span></label>
                <input ref={searchRef} id="team-search" type="search" value={search} onChange={handleTeamShift} placeholder="Tên đội bóng" />
              </div>
            </div>
          </div>

          <p className="search-count" aria-live="polite">Tìm thấy {visibleMatches.length} trận</p>
          {showSampleLoading && <div className="loading-state" role="status"><span className="loading-state__line" aria-hidden="true" /><span>Đang tải lịch thi đấu...</span></div>}
          {showSampleError && <div className="error-state" role="alert"><p>Không tải được lịch thi đấu.</p><button className="button button--quiet" type="button" onClick={() => window.location.reload()}>Tải lại trang</button></div>}
          {!showSampleLoading && !showSampleError && visibleMatches.length === 0 && <p className="empty-state">{selectedMatches.length === 0 ? 'Chưa có trận đấu nào.' : 'Không tìm thấy trận phù hợp.'}</p>}
          {!showSampleLoading && !showSampleError && visibleMatches.length > 0 && (
            <div className="table-scroll">
              <table className="fixtures-table">
                <caption className="visually-hidden">Lịch thi đấu và tỷ số</caption>
                <thead><tr><th scope="col">Vòng</th><th scope="col">Đội nhà</th><th scope="col">BT nhà</th><th scope="col">BT khách</th><th scope="col">Đội khách</th><th scope="col">Kết quả</th><th scope="col">Render</th><th scope="col"><span className="visually-hidden">Thao tác</span></th></tr></thead>
                <tbody>{visibleMatches.map((match) => <MatchRow key={match.id} match={match} onGoals={handleGoalsChange} onRemove={handleRemove} />)}</tbody>
              </table>
            </div>
          )}
          <div className="sample-reset">
            <button className="button button--quiet" type="button" disabled={!canResetSample} onClick={() => {
              dispatch(setMatches(data));
              showNotice('Đã đặt lại dữ liệu mẫu');
            }}>Đặt lại dữ liệu mẫu</button>
          </div>
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
