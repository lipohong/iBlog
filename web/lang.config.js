import zh from './assets/locales/zh/zh-hk.js';
import en from './assets/locales/en/en-us.js';

export default {
  locales: ['en', 'zh'],
  strategy: 'prefix',
  defaultLocale: 'en',
  vueI18n: {
    fallbackLocale: 'en',
    messages: {
      en,
      zh
    }
  }
}