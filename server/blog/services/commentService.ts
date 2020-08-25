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

async function checkLiked(blogId: string, userId: string) {
  try {
    const { data } = await axios.get(`${globalVars.commentUrl}/likes/blog/${blogId}/user/${userId}`);

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

async function checkCollected(blogId: string, userId: string) {
  try {
    const { data } = await axios.get(`${globalVars.commentUrl}/collections/blog/${blogId}/user/${userId}`);

    return data.payload;
  } catch (err) {
    throw handleAxiosException(err);
  }
}

export { getCommentAmountForBlogs, getLikeAmountForBlogs, checkLiked, checkCollected };