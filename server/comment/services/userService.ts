import axios from 'axios';
import globalVars from '../models/globalVars';
import { handleAxiosException } from '../utils/handleAxiosException';


async function getUserList(ids: string[]) {
  try {
    const { data } = await axios.post(`${globalVars.userUrl}/users/users`, ids);

    return data.payload;
  } catch (err) {
    throw handleAxiosException(err);
  }
}


export { getUserList };