import * as express from 'express';
import login from '../middlewares/login';
import { UserController } from '../controllers/userController';

import auth from '../middlewares/auth';

export class userRoute {

  public userController: UserController = new UserController();

  public routes(app): void {
    app.use('/api/users', this.userRoute());

  }

  private userRoute() {
    let router = express.Router();

    router.post('/', login);
    router.get('/emailView', this.userController.emailView);
    router.post('/signUp', this.userController.sendVerifyEmail);
    router.get('/signUp/:verifyCode', this.userController.registerVerify);
    router.post('/forgetPassword', this.userController.sendForgetPasswordEmail);
    router.get('/forgetPassword/:verifyCode', this.userController.forgetPasswordVerify);
    router.post('/facebook', this.userController.loginThroughFacebook);
    router.get('/', auth, this.userController.getMyInfo);
    router.get('/:userId', this.userController.getUserById);

    return router;
  }

}