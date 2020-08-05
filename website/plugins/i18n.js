const defaultNextI18Next = require('next-i18next').default
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig

const localeSubpathVariations = {
  none: {},
  foreign: {
    zh: 'zh',
  },
  all: {
    en: 'en',
    zh: 'zh',
  },
}

module.exports = new defaultNextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['zh'],
  localeSubpaths: localeSubpathVariations[localeSubpaths]
})
