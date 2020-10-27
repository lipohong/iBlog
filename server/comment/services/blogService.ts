import axios from 'axios';
import globalVars from '../models/globalVars';
import { handleAxiosException } from '../utils/handleAxiosException';


async function getBlogList(ids: string[]) {
  try {
    const { data } = await axios.post(`${globalVars.blogUrl}/blogs/blogs`, ids);

    return data.payload;
  } catch (err) {
    throw handleAxiosException(err);
  }
}


export { getBlogList };