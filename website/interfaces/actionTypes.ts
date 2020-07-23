import { SET_PALETTETYPE, SET_THEME } from '../constants/actionTypes';

export interface setPaletteTypeAction {
  type: typeof SET_PALETTETYPE,
  paletteType: string
}

export interface setThemeAction {
  type: typeof SET_THEME,
  theme: number
}

export interface IMessage {
  open: boolean,
  message: string,
  severity: string
}

export interface IAuth {
  userId: string,
  jwt: string
}