import axios from 'axios';

import { SET_USER } from '../../constants/actionTypes';
import { IAuth } from '../../interfaces/actionTypes';
import { IUser } from '../../interfaces/user';

export const setUser = async (auth: IAuth) => {
  try {
    console.log(auth);
    
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_USER_API}/users/${auth.userId}`);
  
    return {
      type: SET_USER,
      user: data.payload
    }
  } catch (err) {
    throw err;
  }
}
