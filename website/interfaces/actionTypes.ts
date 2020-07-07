import { SET_PALETTETYPE } from '../constants/actionTypes'
export interface setPaletteTypeAction {
  type: typeof SET_PALETTETYPE,
  paletteType: string
}