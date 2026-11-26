import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMatch, selectMatches } from '../features/matchesSlice';
import { useNotice } from '../context/NoticeContext';
import { MAX_GOALS, ROUNDS, TEAMS } from '../data';
import { getTeamName, isValidGoals } from '../utils';

const INITIAL_FORM = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

function AddMatchForm() {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const showNotice = useNotice();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const homeTeamRef = useRef(null);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
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

    dispatch(addMatch({
      round: Number(form.round),
      home: homeId,
      away: awayId,
      homeGoals,
      awayGoals,
    }));
    showNotice(`Đã thêm trận ${getTeamName(homeId)} - ${getTeamName(awayId)}`);
    setForm(INITIAL_FORM);
    setErrors({});
    homeTeamRef.current?.focus();
  };

  return (
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
  );
}

export default AddMatchForm;
