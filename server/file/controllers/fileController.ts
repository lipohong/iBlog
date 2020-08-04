import { IERequest, IEResponse } from '../models/commonModel';
import globalVars from '../models/globalVars';
import * as fs from 'fs';
const path = require("path");
import { getGoogleDriveAuth, getAuthURL, setAuthToken } from '../services/fileService'
const { google } = require('googleapis');

export class FileController {

  public async getFileByFileId(req: IERequest, res: IEResponse) {
    try {
      const auth = await getGoogleDriveAuth();
      const drive = google.drive({version: 'v3', auth});
      const fileId = req.params.fileId;
      const tempFileFolderPath = '../tmp';
      const tempFilePath = '../tmp/photo.jpg';
      const dest = fs.createWriteStream(path.resolve(__dirname, tempFilePath));
      drive.files.get({
        fileId: fileId,
        alt: 'media'
      },{
        responseType: 'stream'
      }, (err, result) => {
        if (!!err || !result || !result.data) {
          
          return res.throwErr(new Error('ex_file_not_found'));
        }
        result.data.on('end',  () => {
          let rootPath = path.resolve(__dirname, tempFileFolderPath);
          const options = {
              root: rootPath,
              dotfiles: 'allow'
          }
          res.sendFile('photo.jpg', options, function (err) {
            if (err) return res.throwErr(new Error('ex_send_back_file_fail'));
            return;
          })
        })
        .on('error', (err) => {
          return res.throwErr(new Error('ex_drive_download_fail'));
        })
        .pipe(dest);
      })
      

    } catch (err) {

      return res.throwErr(err);
    }
  }

  public async uploadFile(req: IERequest, res: IEResponse) {
    try {
      const auth = await getGoogleDriveAuth();
      const drive = google.drive({version: 'v3', auth});
      let formidable = require('formidable');
      let form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.keepExtensions = true;
      form.parse(req);
      form.on('file', (name, file) => {
        const fileMetadata = {
          'name': file.name,
          'parents': [globalVars.googleDriveFolderId]
        };
        const media = {
          mimeType: file.type,
          body: fs.createReadStream(file.path)
        };
        drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id'
        }, (err, result) => {
          if (!!err || !result || !result.data) {
            console.log(err);
            
            return res.throwErr(new Error('ex_upload_to_drive_fail'));
          } else {
            return res.success(null, { fileId: result.data.id });
          }
        });
      });
      form.on('error', function(err) {
  
        throw new Error(err.toString());
      })
    } catch (err) {

      return res.throwErr(err);
    }
  }

  public async getGoogleAuthURL(req: IERequest, res: IEResponse) {
    try {
      const token = getAuthURL();

      return res.success(null, token);
    } catch (err) {

      return res.throwErr(err);
    }
  }

  public async setGoogleAuthToken(req: IERequest, res: IEResponse) {
    try {
      if (!req.body.code) throw new Error('ex_no_token');
      await setAuthToken(req.body.code);

      return res.success('msg_set_token_success', null);
    } catch (err) {

      return res.throwErr(err);
    }
  }
}
