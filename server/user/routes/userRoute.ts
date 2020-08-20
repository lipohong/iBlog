import * as express from 'express';
import login from '../middlewares/login';
import { UserController } from '../controllers/userController';

const auth = require('../middlewares/auth');

export class userRoute {

  public userController: UserController = new UserController();

  public routes(app): void {
    app.use('/api/users', this.userRoute());

  }

  private userRoute() {
    let router = express.Router();

    router.post('/', auth(false), login);
    router.get('/emailView', auth(false), this.userController.emailView);
    router.post('/register', auth(false), this.userController.sendVerifyEmail);
    router.post('/registerVerify', auth(false), this.userController.registerVerify);
    router.post('/forgetPassword', auth(false), this.userController.sendForgetPasswordEmail);
    router.post('/newPassword', auth(true), this.userController.sendNewPasswordEmail);
    router.post('/resetPassword', auth(false), this.userController.resetPasswordVerify);
    router.post('/facebook', auth(false), this.userController.loginThroughFacebook);
    router.get('/', auth(true), this.userController.getMyInfo);
    router.put('/', auth(true), this.userController.update);
    router.get('/:userId', auth(false), this.userController.getUserById);

    return router;
  }

}