import { combineReducers } from 'redux';
import * as types from './types';

const modeReducer = (state = { mode: 'light' }, { type, mode }) => {
  switch (type) {
    case types.SET_MODE:
      return {
        mode
      }
    default:
      return state
  }
}

const themeReducer = (state = { theme: 0 }, { type, theme }) => {
  switch (type) {
    case types.SET_THEME:
      return {
        theme
      }
    default:
      return state
  }
}

// COMBINED REDUCERS
const reducers = {
  mode: modeReducer,
  theme: themeReducer,
}

export default combineReducers(reducers);