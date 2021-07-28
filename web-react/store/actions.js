import * as types from './types';

// SET THE THEME
export const setTheme = theme => ({ type: types.SET_THEME, theme });
// SET THE MODE
export const setMode = mode =>({ type: types.SET_MODE, mode });