import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './App.css';
import { formatDiff, MAX_GOALS, RESULT_LABELS, ROUNDS, TEAMS } from './data';
import { matchesReducer } from './matchesReducer';
import { useFetch } from './hooks/useFetch';
import { calcMatchStats, calcStandings, getResult, getTeamName, isValidGoals } from './utils';

const BUILD_TAG = "bd-5918";
const INITIAL_FORM = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

function App() {
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const [roundFilter, setRoundFilter] = useState('all');
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const homeTeamRef = useRef(null);
  const { data, loading, error } = useFetch('/data/matches.json');

  useEffect(() => {
    if (Array.isArray(data)) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const selectedMatches = useMemo(() => {
    if (roundFilter === 'all') return matches;
    return matches.filter((match) => match.round === Number(roundFilter));
  }, [matches, roundFilter]);
  const stats = useMemo(() => calcMatchStats(selectedMatches), [selectedMatches]);
  const leader = standings[0];

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleGoalsChange = (match, side, event) => {
    const goals = event.currentTarget.valueAsNumber;
    if (!isValidGoals(goals)) return;

    dispatch({
      type: 'SET_GOALS',
      payload: {
        id: match.id,
        homeGoals: side === 'home' ? goals : match.homeGoals,
        awayGoals: side === 'away' ? goals : match.awayGoals,
      },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const homeId = form.home === '' ? null : Number(form.home);
    const awayId = form.away === '' ? null : Number(form.away);

    if (homeId === null) nextErrors.home = 'Hãy chọn đội nhà';
    if (awayId === null) nextErrors.away = 'Hãy chọn đội khách';

    if (homeId !== null && awayId !== null) {
      if (homeId === awayId) {
        nextErrors.away = 'Hai đội phải khác nhau';
      } else {
        const pairingAlreadyExists = matches.some((match) =>
          (match.home === homeId && match.away === awayId)
          || (match.home === awayId && match.away === homeId),
        );
        if (pairingAlreadyExists) nextErrors.away = 'Hai đội đã đá với nhau rồi';
      }
    }

    const homeGoals = form.homeGoals === '' ? NaN : Number(form.homeGoals);
    const awayGoals = form.awayGoals === '' ? NaN : Number(form.awayGoals);
    if (!isValidGoals(homeGoals)) nextErrors.homeGoals = `Số bàn thắng phải là số nguyên từ 0 đến ${MAX_GOALS}`;
    if (!isValidGoals(awayGoals)) nextErrors.awayGoals = `Số bàn thắng phải là số nguyên từ 0 đến ${MAX_GOALS}`;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = ['home', 'away', 'homeGoals', 'awayGoals'].find((field) => nextErrors[field]);
      const fieldIds = { home: 'add-home', away: 'add-away', homeGoals: 'add-home-goals', awayGoals: 'add-away-goals' };
      document.getElementById(fieldIds[firstInvalid])?.focus();
      return;
    }

    dispatch({
      type: 'ADD',
      payload: {
        round: Number(form.round),
        home: homeId,
        away: awayId,
        homeGoals,
        awayGoals,
      },
    });
    setForm(INITIAL_FORM);
    setErrors({});
    homeTeamRef.current?.focus();
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
          <button className="remove-button" type="button" onClick={() => dispatch({ type: 'REMOVE', payload: match.id })} aria-label={`Xóa trận ${homeName} - ${awayName}`}>
            Xóa
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="app" data-build={BUILD_TAG}>
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
          </div>
          <a className="button button--primary" href="#add-match">Thêm trận</a>
        </section>

        <section className="stats-section" id="statistics" aria-labelledby="statistics-title">
          <h2 className="visually-hidden" id="statistics-title">Thống kê giải đấu</h2>
          <dl className="stats-grid" aria-live="polite">
            <div className="stat">
              <dt>Số trận</dt>
              <dd className="stat__value">{stats.count}</dd>
            </div>
            <div className="stat">
              <dt>Tổng số bàn thắng</dt>
              <dd className="stat__value">{stats.goals}</dd>
            </div>
            <div className="stat">
              <dt>Bàn thắng mỗi trận</dt>
              <dd className="stat__value">{stats.average.toFixed(2)}</dd>
            </div>
            <div className="stat stat--leader">
              <dt>Đội dẫn đầu</dt>
              <dd className="stat__leader">{stats.count === 0 ? '—' : <>{leader.name}<span>{leader.points} điểm</span></>}</dd>
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

          {loading && (
            <div className="loading-state" role="status">
              <span className="loading-state__line" aria-hidden="true" />
              <span>Đang tải lịch thi đấu...</span>
            </div>
          )}
          {error && (
            <div className="error-state" role="alert">
              <p>Không tải được lịch thi đấu.</p>
              <button className="button button--quiet" type="button" onClick={() => window.location.reload()}>Tải lại trang</button>
            </div>
          )}
          {!loading && !error && selectedMatches.length === 0 && <p className="empty-state">Chưa có trận đấu nào.</p>}
          {!loading && !error && selectedMatches.length > 0 && (
            <div className="table-scroll">
              <table className="fixtures-table">
                <caption className="visually-hidden">Lịch thi đấu và tỷ số</caption>
                <thead>
                  <tr>
                    <th scope="col">Vòng</th>
                    <th scope="col">Đội nhà</th>
                    <th scope="col">BT nhà</th>
                    <th scope="col">BT khách</th>
                    <th scope="col">Đội khách</th>
                    <th scope="col">Kết quả</th>
                    <th scope="col"><span className="visually-hidden">Thao tác</span></th>
                  </tr>
                </thead>
                <tbody>{renderMatchRows()}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="section standings-section" id="standings" aria-labelledby="standings-title">
          <div className="section-heading section-heading--compact">
            <div>
              <h2 id="standings-title">Bảng xếp hạng</h2>
              <p>Xếp theo điểm, hiệu số, bàn thắng và tên đội.</p>
            </div>
          </div>
          <div className="table-scroll standings-scroll">
            <table className="standings-table">
              <caption className="visually-hidden">Bảng xếp hạng sáu đội bóng</caption>
              <thead>
                <tr>
                  <th scope="col">Hạng</th><th scope="col">Đội</th><th scope="col">Trận</th><th scope="col">Thắng</th><th scope="col">Hòa</th><th scope="col">Thua</th><th scope="col">BT</th><th scope="col">BB</th><th scope="col">HS</th><th scope="col">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => (
                  <tr className={index === standings.length - 1 ? 'standing-row standing-row--last' : 'standing-row'} key={team.id}>
                    <td data-label="Hạng">{index + 1}</td>
                    <th scope="row" data-label="Đội">{team.name}</th>
                    <td data-label="Trận">{team.played}</td>
                    <td data-label="Thắng">{team.won}</td>
                    <td data-label="Hòa">{team.drawn}</td>
                    <td data-label="Thua">{team.lost}</td>
                    <td data-label="Bàn thắng">{team.gf}</td>
                    <td data-label="Bàn thua">{team.ga}</td>
                    <td data-label="Hiệu số">{formatDiff(team.diff)}</td>
                    <td className="standing-points" data-label="Điểm">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section add-section" id="add-match" aria-labelledby="add-title">
          <div className="section-heading">
            <div>
              <h2 id="add-title">Thêm trận đấu</h2>
              <p>Mỗi cặp đội chỉ gặp nhau một lần.</p>
            </div>
          </div>
          <form className="add-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field form-field--round">
              <label htmlFor="add-round">Vòng</label>
              <select id="add-round" name="round" value={form.round} onChange={(event) => updateForm('round', event.target.value)}>
                {ROUNDS.map((round) => <option key={round} value={round}>Vòng {round}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="add-home">Đội nhà</label>
              <select id="add-home" name="home" ref={homeTeamRef} value={form.home} onChange={(event) => updateForm('home', event.target.value)} aria-invalid={Boolean(errors.home)} aria-describedby={errors.home ? 'error-home' : undefined} aria-required="true" required>
                <option value="">-- Chọn đội --</option>
                {TEAMS.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
              <span className="field-error" id="error-home" role={errors.home ? 'alert' : undefined}>{errors.home || ''}</span>
            </div>
            <div className="form-field">
              <label htmlFor="add-away">Đội khách</label>
              <select id="add-away" name="away" value={form.away} onChange={(event) => updateForm('away', event.target.value)} aria-invalid={Boolean(errors.away)} aria-describedby={errors.away ? 'error-away' : undefined} aria-required="true" required>
                <option value="">-- Chọn đội --</option>
                {TEAMS.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
              <span className="field-error" id="error-away" role={errors.away ? 'alert' : undefined}>{errors.away || ''}</span>
            </div>
            <div className="form-field form-field--goals">
              <label htmlFor="add-home-goals">Bàn thắng đội nhà</label>
              <input id="add-home-goals" name="homeGoals" type="number" min="0" max={MAX_GOALS} value={form.homeGoals} onChange={(event) => updateForm('homeGoals', event.target.value)} aria-invalid={Boolean(errors.homeGoals)} aria-describedby={errors.homeGoals ? 'error-home-goals' : undefined} aria-required="true" required />
              <span className="field-error" id="error-home-goals" role={errors.homeGoals ? 'alert' : undefined}>{errors.homeGoals || ''}</span>
            </div>
            <div className="form-field form-field--goals">
              <label htmlFor="add-away-goals">Bàn thắng đội khách</label>
              <input id="add-away-goals" name="awayGoals" type="number" min="0" max={MAX_GOALS} value={form.awayGoals} onChange={(event) => updateForm('awayGoals', event.target.value)} aria-invalid={Boolean(errors.awayGoals)} aria-describedby={errors.awayGoals ? 'error-away-goals' : undefined} aria-required="true" required />
              <span className="field-error" id="error-away-goals" role={errors.awayGoals ? 'alert' : undefined}>{errors.awayGoals || ''}</span>
            </div>
            <div className="form-submit">
              <button className="button button--primary" type="submit">Thêm trận</button>
            </div>
          </form>
        </section>
        <footer className="page-footer"><span>Giải bóng đá khoa</span><span>6 đội bóng, 5 vòng đấu</span></footer>
      </main>
    </div>
  );
}

export default App;
