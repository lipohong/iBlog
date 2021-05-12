from __future__ import print_function
import pickle
import os
import shutil
import time
import json
from apiclient.http import MediaFileUpload
from apiclient import errors
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

configFile = open(os.path.join(os.path.dirname(__file__),
                               "config.json"), encoding="utf-8-sig")
configs = json.load(configFile)
configFile.close()


# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/drive']
DATETIME = time.strftime('%Y%m%d-%H%M%S')

# database setting
COMPRESS_DATABASE_FILE_NAME = DATETIME + "_database.tar.gz"


# compress files
def run_tar(backupPathOrURI, compressFileURI):
    try:
        compress_cmd = "tar -czvf " + compressFileURI + " -C " + backupPathOrURI + " ."
        os.system(compress_cmd)
    except (errors):
        print('An error occurred: %s' % errors)


def insert_file_into_folder(service, compressFileName, compressFileURI, folderId):
    try:
        fileMetadata = {
            'name': compressFileName,
            'parents': [folderId]
        }
        media = MediaFileUpload(compressFileURI, mimetype='application/*')
        service.files().create(body=fileMetadata, media_body=media, fields='id').execute()
    except (errors.HttpError):
        print('An error occurred: %s' % errors.HttpError)


def backupDatabase(serviceV3):
    # create tmp folder
    currentPath = os.path.dirname(__file__)
    tmpFolderPath = currentPath + '/tmp'
    if os.path.exists(tmpFolderPath) and os.path.isdir(tmpFolderPath):
        shutil.rmtree(tmpFolderPath)
    os.mkdir(tmpFolderPath)
    databaseBackPath = currentPath + '/tmp/backup'
    os.mkdir(databaseBackPath)
    databaseCompressPath = currentPath + '/tmp/compress'
    os.mkdir(databaseCompressPath)
    COMPRESS_DATABASE_FILE_URI = databaseCompressPath + \
        "/" + COMPRESS_DATABASE_FILE_NAME

    # output database data to database backup file
    dumpcmd = "/usr/bin/mongodump --out=" + databaseBackPath + " --host 127.0.0.1 --port 27017 -u" + \
        configs['databaseUsername'] + " -p" + configs['databasePassword']
    os.system(dumpcmd)

    # Compress database backup file
    run_tar(databaseBackPath, COMPRESS_DATABASE_FILE_URI)

    # transfer file into the backup folder
    insert_file_into_folder(serviceV3, COMPRESS_DATABASE_FILE_NAME,
                            COMPRESS_DATABASE_FILE_URI, configs['databaseBackupFolderId'])

    # remove tmp folder
    os.system('/usr/bin/rm -rf ' + tmpFolderPath)


def main():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists(os.path.join(os.path.dirname(__file__), 'token.pickle')):
        with open(os.path.join(os.path.dirname(__file__), 'token.pickle'), 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                os.path.join(os.path.dirname(__file__), 'client_id.json'), SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(os.path.join(os.path.dirname(__file__), 'token.pickle'), 'wb') as token:
            pickle.dump(creds, token)
    serviceV3 = build('drive', 'v3', credentials=creds)

    # backups
    backupDatabase(serviceV3)


if __name__ == '__main__':
    main()
