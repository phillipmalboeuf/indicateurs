
import type { TypeSystemSkeleton } from '$lib/clients/content_types.js'
import { entry } from '$lib/clients/contentful'


export const load = async ({ params }) => {
  const system = await entry<TypeSystemSkeleton>('3qLoiQqZxJNss30lTE0mdA')
  const categories = [
    ...system.fields.piliers,
    ...system.fields.piliers.flatMap(pilier => pilier.fields.sousCategories || [])
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
      categorie,
      indicateurs,
      pilier
    }
  }
	}
