import * as _ from 'lodash';
import { IERequest, IEResponse } from '../models/commonModel';
import BlogModel  from '../models/blog/class/blogModel';
import BlogStatus from '../models/blog/enum/blogStatus';
import { getBlog, getBlogs, getBlogPagination, saveNewBlog, updateBlog, getBlogsAmount, getTop5ViewedBlogs, getTop5BlogPosters } from '../services/blogService';
import { getUserList } from '../services/userService';

export class BlogController {

  public getBlogById = async (req: IERequest, res: IEResponse) => {
    try {
      const blogId = req.params.blogId;
      const expression = { _id: blogId, isDeleted: false };
      let blog = await getBlog(expression);
      const userId = _.get(req, 'state.jwtPayload.userId');
      if (blog.userId !== userId && blog.status !== BlogStatus.published) {
        throw new Error('ex_cannot_find_blog');
      }
      // view amount + 1
      blog.viewed = blog.viewed ? blog.viewed + 1 : 1;
      await updateBlog(expression, { viewed: blog.viewed });

      return res.success(null, new BlogModel(blog, 'fetch'));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public search = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { status: BlogStatus.published, isDeleted: false  };
      if (req.query.search) {
        expression['$or'] = [];
        expression['$or'].push({ title: new RegExp(req.query.search.toString(), 'ig') });
        expression['$or'].push({ content: new RegExp(req.query.search.toString(), 'g') });
      }
      if (req.query.categories) {
        const categoriesList = req.query.categories.toString().split(',');
        expression['categories'] = { $in: categoriesList }
      }
      if (req.query.tags) {
        const tagsList = req.query.tags.toString().split(',');
        expression['tags'] = { $in: tagsList }
      }
      const page = req.query.page;
      const perPage = req.query.perPage;
      let pageObject = null;
      if (page && perPage) {
        pageObject = {
          page: Number(page),
          perPage: Number(perPage)
        }
      }
      const resultObject = await getBlogPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getMyBlogs = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { userId: req.state.jwtPayload.userId, isDeleted: false };
      if (req.query.search) {
        expression['$or'] = [];
        expression['$or'].push({ title: new RegExp(req.query.search.toString(), 'ig') });
        expression['$or'].push({ content: new RegExp(req.query.search.toString(), 'g') });
      }
      if (req.query.categories) {
        const categoriesList = req.query.categories.toString().split(',');
        expression['categories'] = { $in: categoriesList }
      }
      if (req.query.tags) {
        const tagsList = req.query.tags.toString().split(',');
        expression['tags'] = { $in: tagsList }
      }
      const page = req.query.page;
      const perPage = req.query.perPage;
      let pageObject = null;
      if (page && perPage) {
        pageObject = {
          page: Number(page),
          perPage: Number(perPage)
        }
      }
      const resultObject = await getBlogPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getBlogsByIds = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { _id: { $in: req.body }, status: BlogStatus.published, isDeleted: false };

      const resultObject = await getBlogs(expression, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getUserBlogs = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { userId: req.params.userId, status: BlogStatus.published, isDeleted: false };
      if (req.query.search) {
        expression['$or'] = [];
        expression['$or'].push({ title: new RegExp(req.query.search.toString(), 'ig') });
        expression['$or'].push({ content: new RegExp(req.query.search.toString(), 'g') });
      }
      if (req.query.categories) {
        const categoriesList = req.query.categories.toString().split(',');
        expression['categories'] = { $in: categoriesList }
      }
      if (req.query.tags) {
        const tagsList = req.query.tags.toString().split(',');
        expression['tags'] = { $in: tagsList }
      }
      const page = req.query.page;
      const perPage = req.query.perPage;
      let pageObject = null;
      if (page && perPage) {
        pageObject = {
          page: Number(page),
          perPage: Number(perPage)
        }
      }
      const resultObject = await getBlogPagination(expression, pageObject, null);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getTop5ViewedBlogs = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { status: BlogStatus.published, isDeleted: false };

      const resultObject = await getTop5ViewedBlogs(expression);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getTop5BlogPosters = async (req: IERequest, res: IEResponse) => {
    try {
      const expresssions = [
        { $match: { status: BlogStatus.published, isDeleted: false } },
        { $group: { _id: "$userId", blogs: { $sum: 1 } } },
        { $sort: { blogs: -1 } },
        { $limit: 5 }
      ];

      const resultObject = await getTop5BlogPosters(expresssions);
      const userIdsList = resultObject.map(item => (item._id));
      const userList = await getUserList(userIdsList);
      const userListMap = _.keyBy(userList, '_id');      

      return res.success(null, resultObject.map(user => ({ ...user, ...userListMap[user._id] })));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getUserBlogsAmount = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { userId: req.params.userId, status: BlogStatus.published, isDeleted: false };

      return res.success(null, { amount: await getBlogsAmount(expression) });
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public create = async (req: IERequest, res: IEResponse) => {
    try {
      const model = new BlogModel(req.body, 'post');
      if (!model.title || !model.title.trim()) {
        throw new Error('ex_no_title');
      }
      model.title = model.title.trim();
      model.userId = req.state.jwtPayload.userId;
      const blog = await saveNewBlog(model);

      return res.success("msg_create_blog_success", blog);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public update = async (req: IERequest, res: IEResponse) => {
    try {
      const model = new BlogModel(req.body, 'put');      
      const expression = { _id: req.params.blogId, userId: req.state.jwtPayload.userId, isDeleted: false };
      await getBlog(expression);
      if (model.title) {
        model.title = model.title.trim();
      }

      return res.success("msg_update_blog_success", await updateBlog(expression, model));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public remove = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.blogId, userId: req.state.jwtPayload.userId, isDeleted: false };
      const blog = await getBlog(expression);
      if (!blog) {
        throw new Error('ex_cannot_find_blog');
      }
      await updateBlog(expression, { isDeleted: true });

      return res.success("msg_remove_blog_success", null);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}