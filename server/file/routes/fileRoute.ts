import * as express from 'express';
import { FileController } from '../controllers/fileController';

import auth from '../middlewares/auth';

export class userRoute {

  public fileController: FileController = new FileController();

  public routes(app): void {
    app.use('/api/files', this.fileRoute());

  }

  private fileRoute() {
    let router = express.Router();

    router.get('/:fileId', this.fileController.getFileByFileId);
    router.post('/', auth, this.fileController.uploadFile);

    return router;
  }

}