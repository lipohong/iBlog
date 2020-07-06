import { SET_MODE } from '../constants/actionTypes'
export interface setModeAction {
  type: typeof SET_MODE,
  mode: string
}