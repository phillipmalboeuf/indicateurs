import { contentful, entries } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = params.locale
	const [categories] = await Promise.all([
    entries('categorie', locale)
  ])

  return {
    body: {
      categories
    }
  }
}