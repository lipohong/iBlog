import I18N from './lang.config';

export default {
    modules: [
        '@nuxtjs/vuetify',
        '@nuxtjs/axios',
        ['nuxt-i18n', I18N]
    ],
    css: [
        './assets/style/scss/index.scss'
    ],
    build: {
        transpile: ['vuetify/lib']
    },
    buildModules: ['@nuxt/typescript-build', ["@nuxtjs/vuetify"]],
    server: {
        port: 3004
    },
    head: {
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui' },
        ]
      }
}