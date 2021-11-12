import { contentful, entries } from '$lib/clients/contentful'
import { ids } from '../index.json'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = query.get('locale')
  const categories = await entries<{ id: string, sousCategories: Entry<{ id: string }>[] }>('categorie', locale)
  const categorie = categories.find(c => c.fields.id === params.id)


  const sousCategories = categorie.fields.sousCategories?.map(s => s.fields.id)
  const pilier = categories.find(c => c.fields.sousCategories?.find(s => s.fields.id === params.id))

  const indicateurs = sousCategories
    ? (await entries<{ id: string, categorie: Entry<{ id: string }> }>('indicateur', locale))
      .filter(i => sousCategories.includes(i.fields.categorie.fields.id))
    : await entries<{ id: string, categorie: Entry<{ id: string }> }>('indicateur', locale,
      { 'fields.categorie.fields.id': params.id, 'fields.categorie.sys.contentType.sys.id': 'categorie' })

  // indicateurs.sort((a, b) => a.fields.categorie.fields.id.localeCompare(b.fields.categorie.fields.id))

  if (categorie) {
    return {
      body: {
        categorie,
        indicateurs: ids.map(id => indicateurs.find(i => i.fields.id === id)).filter(i => i),
        pilier
      }
    }
  }
}