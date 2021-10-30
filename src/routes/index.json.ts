import { contentful, entries } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = query.get('locale')
	const [categories, indicateurs] = await Promise.all([
    entries('categorie', locale),
    entries('indicateur', locale)
  ])

  return {
    body: {
      categories,
      indicateurs
    }
  }
}