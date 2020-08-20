import * as express from 'express';
import { FollowController } from '../controllers/followController';
const auth = require('../middlewares/auth');

export class followRoute {

  public followController: FollowController = new FollowController();

  public routes(app): void {
    app.use('/api/follows', this.followRoute());

  }

  private followRoute() {
    let router = express.Router();

    router.get('/', auth(true), this.followController.getMyFollows);
    router.get('/fans', auth(true), this.followController.getMyFans);
    router.get('/:userId', auth(false), this.followController.getFollowsByUserId);
    router.get('/:userId/fans', auth(false), this.followController.getFansByUserId);
    router.post('/:userId', auth(true), this.followController.followOrUnfollow);
    router.put('/:followId', auth(true), this.followController.update);

    return router;
  }

}