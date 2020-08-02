import * as readline from 'readline';
const { google } = require('googleapis');
const fs = require('fs');
const path = require("path");

async function getGoogleDriveAuth(): Promise<any> {
  try {
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    const TOKEN_PATH = '../secrect/token.json';
    const tokenPath: string = path.resolve(__dirname, TOKEN_PATH);
    const creditialFilePath: string = path.resolve(__dirname, '../secrect/credentials.json');
    let oAuth2Client: any;
    const creditialData = fs.readFileSync(creditialFilePath, 'utf8');
    if (!creditialData) {
      throw new Error('Error loading client secret file');
    }
    const {client_secret, client_id, redirect_uris} = JSON.parse(creditialData.toString()).web;   
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    let tokenData: any;
    try {
      tokenData = fs.readFileSync(tokenPath, 'utf8');
    } catch (err) {}
    if (!tokenData) {
      throw new Error('Error loading token file');

      // const authUrl = oAuth2Client.generateAuthUrl({
      //   access_type: 'offline',
      //   scope: SCOPES,
      // });
      // console.log('Authorize this app by visiting this url:', authUrl);
      // const rl = readline.createInterface({
      //   input: process.stdin,
      //   output: process.stdout,
      // });
      // rl.question('Enter the code from that page here: ', (code) => {
      //   rl.close();
      //   oAuth2Client.getToken(code, (err, token) => {
      //     if (err) return console.error('Error retrieving access token', err);
      //     oAuth2Client.setCredentials(token);
      //     // Store the token to disk for later program executions
      //     fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
      //       if (err) return console.error(err);
      //       console.log('Token stored to', tokenPath);
      //     });
      //   });
      // });
    } else {
      oAuth2Client.setCredentials(JSON.parse(tokenData.toString()));
    }

    return oAuth2Client;
  }
  catch (err) {
    throw err;
  }
}


export { getGoogleDriveAuth }