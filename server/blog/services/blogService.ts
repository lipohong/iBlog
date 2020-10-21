import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { IPageModel } from '../models/commonModel';
import BlogModel from '../models/blog/class/blogModel';
import BlogListPaginationModel from '../models/blog/class/blogListPaginationModel'
import BlogSchema from '../models/blog/schema/blogSchema';
import { removeUndefinedField } from '../utils/removeUndefinedField';
import { getLikeAmountForBlogs, getCommentAmountForBlogs } from './commentService';

const Blog = mongoose.model('Blog', BlogSchema, 'Blog');

async function getBlog(expression: object): Promise<BlogModel> {
  try {
    const blog: any = await Blog.findOne(expression).lean();
    if (!blog) {
      throw new Error('ex_cannot_find_blog');
    }  
    return new BlogModel(blog, 'fetch');
  }
  catch (err) {
    throw err;
  }
}

async function getBlogPagination(expression: object, pageObj: IPageModel, option: object): Promise<BlogListPaginationModel> {
  try {
    let pagination = null;
    if (pageObj) {
      const total: number = await Blog.countDocuments(expression).lean();
      if (!option) {
        option = { skip: pageObj.perPage * (pageObj.page - 1), limit: pageObj.perPage };
      }
      pagination = {
        totalItems: total,
        totalPage: Math.ceil(total / pageObj.perPage),
        perPage: pageObj.perPage,
        currentPage: pageObj.page,
      };
    }
    let blogResultList: BlogModel[] = await Blog.find(expression, null, option).sort({ createdDate: -1 }).lean();
    if (blogResultList.length > 0) {
      const ids = _.map(blogResultList, '_id');
      const commentsMap = await getCommentAmountForBlogs(ids);
      const likesMap = await getLikeAmountForBlogs(ids);
      blogResultList = blogResultList.map(blog => ({
        ...blog,
        comments: commentsMap[blog._id] || 0,
        likes: likesMap[blog._id] || 0
      }))
    }

    const result = new BlogListPaginationModel({
      blogList: blogResultList,
      pagination: pagination
    });

    return result;
  }
  catch (err) {
    throw err;
  }
}

async function saveNewBlog(model: BlogModel): Promise<BlogModel> {
  try {
    const blog: any = await new Blog(model).save();

    return new BlogModel(blog, 'create');
  }
  catch (err) {
    throw err;
  }
}

async function updateBlog(expression: object, updateFields: object): Promise<BlogModel> {
  try {
    updateFields = removeUndefinedField(updateFields);
    if (!updateFields['cover']) {
      updateFields['cover'] = '';
    }
    const blog = await Blog.findOneAndUpdate(expression, { $set: updateFields }).lean();

    return new BlogModel(await getBlog({ _id: blog._id }), 'update');
  }
  catch (err) {
    throw err;
  }
}

async function getBlogsAmount(expression: object): Promise<Number> {
  try {

    return await Blog.countDocuments(expression).lean();
  }
  catch (err) {
    throw err;
  }
}

export { getBlog, getBlogPagination, saveNewBlog, updateBlog, getBlogsAmount }