import { contentful, entries } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'

// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = query.get('locale')
	const indicateurs = await entries('indicateur', locale, { 'fields.id': params.id })

  if (indicateurs.items?.length > 0) {
    return {
      body: {
        indicateur: indicateurs.items[0]
      }
    }
  }
}