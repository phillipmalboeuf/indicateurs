import { contentful, entries } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = params.locale
  console.log(params)
	const [pages] = await Promise.all([
    entries('page', locale, { 'fields.id': params.page }, 3),
    // entries('theme', locale)
  ])

  if (pages.length) {
    return {
      body: {
        page: pages[0]
      }
    }
  }
}