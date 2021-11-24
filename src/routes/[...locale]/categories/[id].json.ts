import { contentful, entries, entry } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = query.get('locale')
  const system = await entry<{ piliers: Entry<any>[], indicateurs: Entry<any>[] }>('3qLoiQqZxJNss30lTE0mdA', locale)
  const categories = [
    ...system.fields.piliers,
    ...system.fields.piliers.flatMap(pilier => pilier.fields.sousCategories)
  ]
  const categorie = categories.find(c => c.fields.id === params.id)
  const pilier = categories.find(c => c.fields.sousCategories?.find(s => s.fields.id === params.id))
  const sousCategories = categorie.fields.sousCategories?.map(s => s.fields.id)

  const indicateurs = sousCategories
    ? system.fields.indicateurs
      .filter(i => i.fields.categorie)
      .filter(i => sousCategories.includes(i.fields.categorie.fields.id))
    : system.fields.indicateurs
      .filter(i => i.fields.categorie.fields.id === params.id)

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