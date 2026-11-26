import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './features/matchesSlice';
import goalReducer from './features/goalSlice';
import { loadSaved, saveMatches } from './storage';

const savedMatches = loadSaved();
export const hasSaved = savedMatches === null;

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    goal: goalReducer,
  },
  preloadedState: { matches: savedMatches ?? [] },
});

let previousMatches = store.getState().matches;
store.subscribe(() => {
  const currentMatches = store.getState().matches;
  if (currentMatches !== previousMatches) {
    saveMatches(currentMatches);
    previousMatches = currentMatches;
  }
});
