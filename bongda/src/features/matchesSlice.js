import { createSlice } from '@reduxjs/toolkit';

const matchesSlice = createSlice({
  name: 'matches',
  initialState: [],
  reducers: {
    setMatches: (_state, action) => [...action.payload],
    addMatch: (state, action) => {
      const nextId = state.reduce((largest, match) => Math.max(largest, match.id), 0) + 1;
      state.push({ ...action.payload, id: nextId });
    },
    removeMatch: (state, action) => state.filter((match) => match.id !== action.payload),
    setGoals: (state, action) => {
      const match = state.find((item) => item.id === action.payload.id);
      if (match) {
        match.homeGoals = action.payload.homeGoals;
        match.awayGoals = action.payload.awayGoals;
      }
    },
  },
});

export const { setMatches, addMatch, removeMatch, setGoals } = matchesSlice.actions;
export const selectMatches = (state) => state.matches;
export default matchesSlice.reducer;
