## Run project locally

### Configuration

1. Create config.env under `config` directory.
2. Copy properties from `config/dev.env` to `config/config.env`.
3. Setup the configuration in `config/config.env`:

```
PORT=8011

JWT_SECRET=
JWT_ISSUER=
JWT_BCRYPT_SALT_ROUNDS=

AES_SECRET=

LOG_LEVEL=

GOOGLE_DRIVE_FOLDER_ID=
```

> _GOOGLE_DRIVE_FOLDER_ID_ is the id of a shared folder of Google drive

4. Run the server:

```
npm run watch
```

5. Import the json file into postman and test the apis: [File api for postman](https://drive.google.com/uc?id=1JqTaG8u_96ltS72y5n3jLRht3N-h1hyN)

---

## Deploy server using docker

```
docker-compose up -d
```
