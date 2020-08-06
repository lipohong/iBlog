import axios from 'axios';

import { SET_AUTH } from '../../constants/actionTypes';
import { IAuth } from '../../interfaces/actionTypes';

export const setAuth = (auth: IAuth) => ({
  type: SET_AUTH,
  auth
})

export const loginWithFacebook = async (postData) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_USER_API}/users/facebook`, postData);

    return {
      type: SET_AUTH,
      user: {
        userId: data.payload.userId,
        jwt: data.payload.jwt
      }
    }
  } catch(err) {
    throw err;
  }
}