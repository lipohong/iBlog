import { SET_PALETTETYPE, SET_THEME } from '../../constants/actionTypes';

export const setPaletteType = (paletteType: string)=> ({
  type: SET_PALETTETYPE || SET_THEME,
  paletteType
})

export const setTheme = (theme: number)=> ({
  type: SET_THEME,
  theme
})
