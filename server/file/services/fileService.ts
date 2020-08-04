const { google } = require('googleapis');
const fs = require('fs');
const path = require("path");

async function getGoogleDriveAuth(): Promise<any> {
  try {
    const TOKEN_PATH = '../secrect/token.json';
    const tokenPath: string = path.resolve(__dirname, TOKEN_PATH);
    let oAuth2Client = getAuthClient();
    let tokenData: any;
    try {
      tokenData = fs.readFileSync(tokenPath, 'utf8');
    } catch (err) {}
    if (!tokenData) {

      throw new Error('ex_no_token_file');
    } else {
      oAuth2Client.setCredentials(JSON.parse(tokenData.toString()));
    }

    return oAuth2Client;
  }
  catch (err) {
    throw err;
  }
}

function getAuthURL(): any {
  try {
    let oAuth2Client = getAuthClient();    
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });

    return authUrl;
}
  catch (err) {
    throw err;
  }
}

async function setAuthToken(code: string): Promise<any> {
  try {
    const TOKEN_PATH = '../secrect/token.json';
    const tokenPath: string = path.resolve(__dirname, TOKEN_PATH);
    const oAuth2Client = getAuthClient();
    const promise = new Promise((resolve, reject) => {
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          reject(new Error('ex_retrieve_access_token_fail'))
        }
        oAuth2Client.setCredentials({
          refresh_token: token.refresh_token
        });
        fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
          if (err) {
            reject(new Error('ex_save_token_to_file_fail'));
          }
          resolve(true);
        });
      });
    })
    
    await Promise.all([promise]);

    return;
  }
  catch (err) {
    throw err;
  }
}

function getAuthClient(): any {
  try {
    const creditialFilePath: string = path.resolve(__dirname, '../secrect/credentials.json');
    let oAuth2Client: any;
    const creditialData = fs.readFileSync(creditialFilePath, 'utf8');
    if (!creditialData) {
      throw new Error('ex_get_credential_file_fail');
    }
    const {client_secret, client_id, redirect_uris} = JSON.parse(creditialData.toString()).web;   
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    return oAuth2Client;
  }
  catch (err) {
    throw err;
  }
}

export { getGoogleDriveAuth, getAuthURL, setAuthToken }