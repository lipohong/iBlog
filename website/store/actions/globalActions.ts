import { SET_PALETTETYPE } from '../../constants/actionTypes';

export const setPaletteType = (paletteType: string)=> ({
  type: SET_PALETTETYPE,
  paletteType
})
