import type { TypePageSkeleton, TypeSystemSkeleton } from '$lib/clients/content_types.js'
import { entry } from '$lib/clients/contentful'

export const load = async ({ params }) => {
	const locale = params.locale
	const [page, system] = await Promise.all([
    entry<TypePageSkeleton>('5nm4pR4zIs8IhngVKfeSlk', locale, {}, 4),
    entry<TypeSystemSkeleton>('3qLoiQqZxJNss30lTE0mdA', locale)
  ])

  return {
    page,
    piliers: system.fields.piliers,
    indicateurs: system.fields.indicateurs
  }
}
