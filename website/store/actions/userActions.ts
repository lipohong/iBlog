import axios from 'axios';

import { SET_USER } from '../../constants/actionTypes';
import { IAuth } from '../../interfaces/actionTypes';

export const setUser = async (auth: IAuth) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_USER_API}/users/${auth.userId}`);
  
    return {
      type: SET_USER,
      user: data.payload
    }
  } catch (err) {
    throw err;
  }
}
