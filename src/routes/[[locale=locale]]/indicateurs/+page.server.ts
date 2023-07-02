import type { TypePageSkeleton, TypeSystemSkeleton } from '$lib/clients/content_types.js'
import { entry } from '$lib/clients/contentful.js'

export const load = async ({ params }) => {
	const locale = params.locale
	const [page, system] = await Promise.all([
    entry<TypePageSkeleton>('6dGBejHvwnM8CnW8xsNXc4', locale, {}, 4),
    entry<TypeSystemSkeleton>('3qLoiQqZxJNss30lTE0mdA', locale)
  ])

  return {
    page,
    piliers: system.fields.piliers,
    indicateurs: system.fields.indicateurs
  }
}
