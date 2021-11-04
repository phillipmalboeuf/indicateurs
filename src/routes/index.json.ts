import { contentful, entries } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = query.get('locale')
	const [categories, indicateurs] = await Promise.all([
    entries('categorie', locale),
    entries<{ categorie: Entry<{ id: string }> }>('indicateur', locale)
  ])

  indicateurs.sort((a, b) => a.fields.categorie.fields.id.localeCompare(b.fields.categorie.fields.id))

  return {
    body: {
      categories,
      indicateurs
    }
  }
}