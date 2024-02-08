import type { TypeCategorieSkeleton, TypeIndicateurSkeleton } from '$lib/clients/content_types.js'
import { entries } from '$lib/clients/contentful.js'


export const load = async ({ params }) => {
  const locale = params.locale
  const indicateurs = await entries<TypeIndicateurSkeleton>('indicateur', locale, { 'fields.id': params.id })

  if (indicateurs.length > 0) {
    const categories = await entries<TypeCategorieSkeleton>('categorie', locale)
    const pilier = categories.find(c => c.fields.sousCategories?.find(s => s.fields.id === indicateurs[0].fields.categorie.fields.id))

    return {
      indicateur: indicateurs[0],
      pilier
    }
  }
}
