import { createClient, type EntrySkeletonType } from 'contentful'

const preview = !!import.meta.env.VITE_PREVIEW

export const contentful = createClient({
  space: 'hldkryaz0p2i',
  accessToken: preview ? 'aHdk-mL_aVpZRAeXAZWmdvPutmhhswlPP5WGUcHOZhM' : 'd4DjmPoHFsAZCRGzxYq7wL65ih-FRMjvEf1lsJq5cIQ',
  ...preview && { host: 'preview.contentful.com' }
}).withoutUnresolvableLinks

export async function entry<T extends EntrySkeletonType>(id: string, locale: string, query: {[key: string]: any}={}, include:1|2|3|4=2) {
  return (await contentful.getEntry<T>(id, { include, locale: {'en': 'en-CA'}[locale], ...query }))
}

export async function entries<T extends EntrySkeletonType>(content_type: string, locale: string, query: {[key: string]: any}={}, include:1|2|3|4=2) {
  return (await contentful.getEntries<T>({ content_type, include, locale: {'en': 'en-CA'}[locale], limit: 200, ...query })).items
}