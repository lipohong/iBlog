import * as mongoose from 'mongoose';
import { IPageModel } from '../models/commonModel';
import BlogModel from '../models/blog/class/blogModel';
import BlogListPaginationModel from '../models/blog/class/blogListPaginationModel'
import BlogSchema from '../models/blog/schema/blogSchema';
import { removeUndefinedField } from '../utils/removeUndefinedField';

const Blog = mongoose.model('Blog', BlogSchema, 'Blog');

async function getBlog(expression: object): Promise<BlogModel> {
  try {
    const blog: any = await Blog.findOne(expression).lean();
    if (!blog) {
      throw new Error('ex_cannot_find_blog');
    }  
    return new BlogModel(blog, 'get');
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

    return new BlogModel(blog, 'fetch');
  }
  catch (err) {
    throw err;
  }
}

async function updateBlog(expression: object, updateFields: object): Promise<BlogModel> {
  try {
    const blog = await Blog.findOneAndUpdate(expression, { $set: removeUndefinedField(updateFields) }).lean();

    return new BlogModel(await getBlog({ _id: blog._id }), 'fetch');
  }
  catch (err) {
    throw err;
  }
}

export { getBlog, getBlogPagination, saveNewBlog, updateBlog }