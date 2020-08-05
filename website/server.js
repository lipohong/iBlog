const express = require('express');
const https = require('https');
const fs = require('fs');
const next = require('next');
const nextI18NextMiddleware = require('next-i18next/middleware').default;

const nextI18next = require('./plugins/i18n.js');

const port = process.env.PORT || 3003;
const portHttps = process.env.PORT_HTTPS || 8080;

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  await nextI18next.initPromise;
  server.use(nextI18NextMiddleware(nextI18next));

  server.get('*', (req, res) => handle(req, res));
  await server.listen(port);

  https.createServer({
    key: fs.readFileSync('./secrect/key.pem'),
    cert: fs.readFileSync('./secrect/cert.pem'),
    passphrase: 'iblog'
  }, server)
  .listen(portHttps);
  console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
})()