export function matchesReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return Array.isArray(action.payload) ? [...action.payload] : [];
    case 'ADD': {
      const nextId = state.reduce((largest, match) => Math.max(largest, match.id), 0) + 1;
      return [...state, { ...action.payload, id: nextId }];
    }
    case 'REMOVE':
      return state.filter((match) => match.id !== action.payload);
    case 'SET_GOALS':
      return state.map((match) => match.id === action.payload.id
        ? { ...match, homeGoals: action.payload.homeGoals, awayGoals: action.payload.awayGoals }
        : match);
    default:
      return state;
  }
}
