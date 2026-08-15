import { translations, translate, type Lang, type TranslationKey } from './translations'

export { translations, translate, type Lang, type TranslationKey }

export function t(key: TranslationKey, lang?: Lang): string {
  return translate(lang ?? currentLang, key)
}

export let currentLang: Lang = 'en'

export function setLanguage(lang: Lang) {
  currentLang = lang
}
