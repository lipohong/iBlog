import zh from './assets/locales/zh/zh-hk.ts';
import en from './assets/locales/en/en-us.ts';

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