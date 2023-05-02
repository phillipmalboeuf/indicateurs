import { contentful, entries, entry } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'


// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = params.locale
	const [page, system] = await Promise.all([
    entry('6dGBejHvwnM8CnW8xsNXc4', locale, {}, 4),
    entry<{ piliers: Entry<any>[], indicateurs: Entry<any>[] }>('3qLoiQqZxJNss30lTE0mdA', locale)
  ])

  return {
    body: {
      page,
      piliers: system.fields.piliers,
      indicateurs: system.fields.indicateurs
    }
  }
}