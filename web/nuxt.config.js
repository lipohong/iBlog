import I18N from './lang.config';

export default {
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    ['nuxt-i18n', I18N]
  ],

  build: {
    transpile: ['vuetify/lib']
  },
  buildModules: ['@nuxt/typescript-build', ["@nuxtjs/vuetify"]],
  server: {
    port: 3004
  }
}