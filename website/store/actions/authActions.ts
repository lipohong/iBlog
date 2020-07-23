import { SET_AUTH } from '../../constants/actionTypes';
import { IAuth } from '../../interfaces/actionTypes';

export const setAuth = (auth: IAuth) => ({
  type: SET_AUTH,
  auth
})
