import { contentful, entries } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = query.get('locale')
  const categories = await entries<{ id: string, sousCategories: Entry<{ id: string }>[] }>('categorie', locale)
  const categorie = categories.items.find(c => c.fields.id === params.id)


  const sousCategories = categorie.fields.sousCategories?.map(s => s.fields.id)
  const pilier = categories.items.find(c => c.fields.sousCategories?.find(s => s.fields.id === params.id))

  const indicateurs = sousCategories
    ? { items: (await entries<{ categorie: Entry<{ id: string }> }>('indicateur', locale))
      .items.filter(i => sousCategories.includes(i.fields.categorie.fields.id)) }
    : await entries('indicateur', locale,
      { 'fields.categorie.fields.id': params.id, 'fields.categorie.sys.contentType.sys.id': 'categorie' })

  

  if (categorie) {
    return {
      body: {
        categorie,
        indicateurs,
        pilier
      }
    }
  }
}