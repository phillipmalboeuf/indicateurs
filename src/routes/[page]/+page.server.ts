import type { TypePageSkeleton } from '$lib/clients/content_types.js'
import { entries } from '$lib/clients/contentful'

export const load = async ({ params }) => {
	const [pages] = await Promise.all([
    entries<TypePageSkeleton>('page', { 'fields.id': params.page }, 3),
    // entries('theme', locale)
  ])

  if (pages.length) {
    return {
      page: pages[0]
    }
  }
}
