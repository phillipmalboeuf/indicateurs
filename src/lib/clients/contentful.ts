import { PREVIEW } from '$env/static/private'
import { getLocale } from '$lib/paraglide/runtime'
import type { EntrySkeletonType } from 'contentful'
import { createClient } from 'contentful'

const preview = PREVIEW === 'true'

export const content = createClient({
  space: 'hldkryaz0p2i',
  accessToken: preview ? 'aHdk-mL_aVpZRAeXAZWmdvPutmhhswlPP5WGUcHOZhM' : 'd4DjmPoHFsAZCRGzxYq7wL65ih-FRMjvEf1lsJq5cIQ',
  ...preview && { host: 'preview.contentful.com' }
}).withoutUnresolvableLinks

export async function entry<T extends EntrySkeletonType>(id: string, query: {[key: string]: any}={}, include:1|2|3|4=2) {
  return (await content.getEntry<T>(id, { include, locale: {'en': 'en-CA'}[getLocale()], ...query }))
}

export async function entries<T extends EntrySkeletonType>(content_type: string, query: {[key: string]: any}={}, include:1|2|3|4=2) {
  return (await content.getEntries<T>({ content_type, include, locale: {'en': 'en-CA'}[getLocale()], limit: 200, ...query })).items
}