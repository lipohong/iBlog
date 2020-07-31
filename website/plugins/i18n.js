const defaultNextI18Next = require('next-i18next').default

module.exports = new defaultNextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['zh'],
  defaultNS: ['common'],
  localeSubpaths: {
    en: 'en',
    zh: 'zh',
  }
})
