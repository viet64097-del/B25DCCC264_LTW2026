import { MAX_GOALS, POINTS, TEAMS } from './data';

export const getTeamName = (id) => TEAMS.find((team) => team.id === Number(id))?.name ?? 'Không rõ đội';

export const getResult = ({ homeGoals, awayGoals }) => {
  if (homeGoals > awayGoals) return 'home';
  if (homeGoals < awayGoals) return 'away';
  return 'draw';
};

export const isValidGoals = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_GOALS;

export const calcStandings = (matches) => {
  const rows = TEAMS.map((team) => ({
    ...team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    diff: 0,
    points: 0,
  }));

  matches.forEach((match) => {
    if (!isValidGoals(match.homeGoals) || !isValidGoals(match.awayGoals)) return;
    const homeTeam = rows.find((team) => team.id === match.home);
    const awayTeam = rows.find((team) => team.id === match.away);
    if (!homeTeam || !awayTeam) return;

    homeTeam.played += 1;
    awayTeam.played += 1;
    homeTeam.gf += match.homeGoals;
    homeTeam.ga += match.awayGoals;
    awayTeam.gf += match.awayGoals;
    awayTeam.ga += match.homeGoals;

    const result = getResult(match);
    if (result === 'home') {
      homeTeam.won += 1;
      awayTeam.lost += 1;
      homeTeam.points += POINTS.win;
    } else if (result === 'away') {
      awayTeam.won += 1;
      homeTeam.lost += 1;
      awayTeam.points += POINTS.win;
    } else {
      homeTeam.drawn += 1;
      awayTeam.drawn += 1;
      homeTeam.points += POINTS.draw;
      awayTeam.points += POINTS.draw;
    }
  });

  rows.forEach((team) => { team.diff = team.gf - team.ga; });
  return [...rows].sort((a, b) =>
    b.points - a.points
    || b.diff - a.diff
    || b.gf - a.gf
    || a.name.localeCompare(b.name, 'vi'),
  );
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;

  matches.forEach((match) => {
    if (!isValidGoals(match.homeGoals) || !isValidGoals(match.awayGoals)) return;
    goals += match.homeGoals + match.awayGoals;
    counts[getResult(match)] += 1;
  });

  const count = matches.filter((match) => isValidGoals(match.homeGoals) && isValidGoals(match.awayGoals)).length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;
  return { count, goals, average, counts };
};
