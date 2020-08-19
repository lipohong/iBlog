import * as express from 'express';
import { CommentController } from '../controllers/commentController';
const auth = require('../middlewares/auth');

export class commentRoute {

  public commentController: CommentController = new CommentController();

  public routes(app): void {
    app.use('/api/comments', this.commentRoute());
  }

  private commentRoute() {
    let router = express.Router();

    router.get('/blog/:blogId', auth(false), this.commentController.getCommentsByBlogId);
    router.get('/', auth(false), this.commentController.getMyComments);
    router.get('/:commentId', auth(false), this.commentController.getCommentById);
    router.post('/', auth(true), this.commentController.create);
    router.post('/blog', auth(false), this.commentController.getCommentAmountForBlogs);
    router.put('/:commentId', auth(true), this.commentController.update);
    router.delete('/:commentId', auth(true), this.commentController.remove);

    return router;
  }

}