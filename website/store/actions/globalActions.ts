import { SET_PALETTETYPE, SET_THEME, SET_MESSAGE } from '../../constants/actionTypes';
import { Message } from '../../interfaces/actionTypes';

export const setPaletteType = (paletteType: string)=> ({
  type: SET_PALETTETYPE,
  paletteType
})

export const setTheme = (theme: number)=> ({
  type: SET_THEME,
  theme
})

export const setMessage = (message: Message)=> ({
  type: SET_MESSAGE,
  message
})
