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
    router.get('/:blogId', auth(false), this.blogController.getBlogById);
    router.post('/', auth(true), this.blogController.create);
    router.put('/:blogId', auth(true), this.blogController.update);
    router.delete('/:blogId', auth(true), this.blogController.remove);

    return router;
  }

}