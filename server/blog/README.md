## Run project locally

### Configuration

1. Create config.env under `config` directory.
2. Copy properties from `config/dev.env` to `config/config.env`.
3. Setup the configuration in `config/config.env`:

```
PORT=8013

JWT_SECRET=
JWT_ISSUER=
JWT_BCRYPT_SALT_ROUNDS=

AES_SECRET=

MONGO_URL=

LOG_LEVEL=

USER_URL=
BLOG_URL=
```

4. Run the server:

```
npm run watch
```

5. Import the json file into postman and test the apis: [Comment api for postman](https://drive.google.com/uc?id=1SKxGi-zZvh4WjLHlDo1Pr_vYpk3ARpqJ)

---

## Deploy server using docker

```
docker-compose up -d
```
