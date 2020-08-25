import * as express from 'express';
import { CollectionController } from '../controllers/collectionController';
const auth = require('../middlewares/auth');

export class collectionRoute {

  public collectionController: CollectionController = new CollectionController();

  public routes(app): void {
    app.use('/api/collections', this.likeRoute());
  }

  private likeRoute() {
    let router = express.Router();

    router.get('/', auth(true), this.collectionController.getMyCollections);
    router.get('/blog/:blogId/user/:userId', auth(false), this.collectionController.checkCollectedByUserId);
    router.get('/:collectionId', auth(false), this.collectionController.getCollectionById);
    router.post('/', auth(true), this.collectionController.create);
    router.put('/:collectionId', auth(true), this.collectionController.update);
    router.delete('/:collectionId', auth(true), this.collectionController.remove);
    router.post('/:collectionId/blog/:blogId', auth(true), this.collectionController.addBlogToCollection);
    router.delete('/:collectionId/blog/:blogId', auth(true), this.collectionController.removeBlogFromCollection);

    return router;
  }

}