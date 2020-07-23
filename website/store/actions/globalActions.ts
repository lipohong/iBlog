import { SET_PALETTETYPE, SET_THEME, SET_MESSAGE, SET_PROGRESS_BAR_ON } from '../../constants/actionTypes';
import { IMessage } from '../../interfaces/actionTypes';

export const setPaletteType = (paletteType: string)=> ({
  type: SET_PALETTETYPE,
  paletteType
})

export const setTheme = (theme: number) => ({
  type: SET_THEME,
  theme
})

export const setMessage = (message: IMessage) => ({
  type: SET_MESSAGE,
  message
})

export const setProgressOn = (progressBarOn: boolean) => ({
  type: SET_PROGRESS_BAR_ON,
  progressBarOn
})
