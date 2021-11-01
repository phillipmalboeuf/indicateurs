import { contentful, entries } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = query.get('locale')
	const indicateurs = await entries<{ categorie: Entry<{ id: string}> }>('indicateur', locale, { 'fields.id': params.id })

  if (indicateurs.length > 0) {
    const categories = await entries<{ id: string, sousCategories: Entry<{ id: string }>[] }>('categorie', locale)
    const pilier = categories.find(c => c.fields.sousCategories?.find(s => s.fields.id === indicateurs[0].fields.categorie.fields.id))

    return {
      body: {
        indicateur: indicateurs[0],
        pilier
      }
    }
  }
}