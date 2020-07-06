import { SET_MODE } from '../../constants/actionTypes';

export const setMode = (mode: string)=> ({
  type: SET_MODE,
  mode
})
