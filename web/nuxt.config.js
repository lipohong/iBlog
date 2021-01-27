import I18N from './lang.config';
require('dotenv').config();

export default {
    modules: [
        '@nuxtjs/axios',
        ['nuxt-i18n', I18N]
    ],
    plugins: [
        '@/plugins/axios.js',
        { src: '~plugins/nuxt-quill-plugin', ssr: false }
    ],
    css: [
        './assets/style/scss/index.scss',
        'quill/dist/quill.core.css',
        'quill/dist/quill.snow.css',
        'quill/dist/quill.bubble.css'
    ],
    build: {
        transpile: ['vuetify/lib']
    },
    buildModules: ['@nuxt/typescript-build', ["@nuxtjs/vuetify"]],
    server: {
        host: '0.0.0.0',
        port: '3004'
    },
    head: {
        titleTemplate: 'iBlog - %s',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui' },
        ]
    },
    env: {
        aesSecrect: process.env.AES_SECRECT,
        userApi: process.env.USER_API,
        fileApi: process.env.FILE_API,
        blogApi: process.env.BLOG_API,
        commentApi: process.env.COMMENT_API,
        googleFileLink: process.env.GOOGLE_FILE_LINK,
    }
}