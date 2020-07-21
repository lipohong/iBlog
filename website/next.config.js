const path = require('path')

module.exports = {
  publicRuntimeConfig: {
    localeSubpaths: typeof process.env.LOCALE_SUBPATHS === 'string'
      ? process.env.LOCALE_SUBPATHS
      : 'none',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, './assets/css/styles')],
  },
  env: {
    userApi: "http://localhost:8010/api"
  }
}