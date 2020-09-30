import zh from './assets/locales/zh/zh-tc.ts';
import en from './assets/locales/en/en-us.ts';

export default {
  locales: ['en', 'zh'],
  strategy: 'prefix_and_default',
  defaultLocale: 'en',
  vueI18n: {
    fallbackLocale: 'en',
    messages: {
      en,
      zh
    }
  }
}