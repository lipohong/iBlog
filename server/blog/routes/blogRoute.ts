import * as express from 'express';
import { BlogController } from '../controllers/blogController';
const auth = require('../middlewares/auth');

export class blogRoute {

  public blogController: BlogController = new BlogController();

  public routes(app): void {
    app.use('/api/blogs', this.blogRoute());
  }

  private blogRoute() {
    let router = express.Router();

    router.get('/', auth(false), this.blogController.search);
    router.get('/myBlogs', auth(true), this.blogController.getMyBlogs);
    router.get('/user/:userId', auth(false), this.blogController.getUserBlogs);
    router.get('/user/:userId/amount', auth(false), this.blogController.getUserBlogsAmount);
    router.get('/top5/viewedBlogs', auth(false), this.blogController.getTop5ViewedBlogs);
    router.get('/top5/blogPosters', auth(false), this.blogController.getTop5BlogPosters);
    router.get('/:blogId', auth(false), this.blogController.getBlogById);
    router.post('/', auth(true), this.blogController.create);
    router.put('/:blogId', auth(true), this.blogController.update);
    router.delete('/:blogId', auth(true), this.blogController.remove);

    return router;
  }

}