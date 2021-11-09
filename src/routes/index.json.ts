import { contentful, entries } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = query.get('locale')
	const [page, categories, indicateurs] = await Promise.all([
    contentful.getEntry('5nm4pR4zIs8IhngVKfeSlk', { include: 2 }),
    entries('categorie', locale),
    entries<{ categorie: Entry<{ id: string }> }>('indicateur', locale)
  ])

  indicateurs.sort((a, b) => a.fields.categorie.fields.id.localeCompare(b.fields.categorie.fields.id))

  return {
    body: {
      page,
      categories,
      indicateurs
    }
  }
}