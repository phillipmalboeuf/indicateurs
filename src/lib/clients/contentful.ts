import { createClient } from 'contentful'

const preview = !!import.meta.env.VITE_PREVIEW

export const contentful = createClient({
  space: 'hldkryaz0p2i',
  accessToken: preview ? 'aHdk-mL_aVpZRAeXAZWmdvPutmhhswlPP5WGUcHOZhM' : 'd4DjmPoHFsAZCRGzxYq7wL65ih-FRMjvEf1lsJq5cIQ',
  ...preview && { host: 'preview.contentful.com' }
})

export async function entry<T>(id: string, locale: string, query: {[key: string]: any}={}, include=2) {
  return (await contentful.getEntry<T>(id, { include, locale: {'en': 'en-CA'}[locale], ...query }))
}

export async function entries<T>(content_type: string, locale: string, query: {[key: string]: any}={}, include=2) {
  return (await contentful.getEntries<T>({ content_type, include, locale: {'en': 'en-CA'}[locale], limit: 200, ...query })).items
}