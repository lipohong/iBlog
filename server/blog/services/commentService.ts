import axios from 'axios';
import globalVars from '../models/globalVars';
import { handleAxiosException } from '../utils/handleAxiosException';

async function getCommentAmountForBlogs(ids: string[]) {
  try {
    const { data } = await axios.post(`${globalVars.commentUrl}/comments/blog`, { blogIds: ids });

    return data.payload;
  } catch (err) {
    throw handleAxiosException(err);
  }
}

async function getLikeAmountForBlogs(ids: string[]) {
  try {
    const { data } = await axios.post(`${globalVars.commentUrl}/likes/blog`, { blogIds: ids });

    return data.payload;
  } catch (err) {
    throw handleAxiosException(err);
  }
}

export { getCommentAmountForBlogs, getLikeAmountForBlogs };