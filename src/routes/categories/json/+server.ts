// import { error } from '@sveltejs/kit';
import { entries } from '$lib/clients/contentful';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ params, url }) => {
	const [categories] = await Promise.all([
    entries('categorie')
  ])

  return json({ categories })
}) satisfies RequestHandler;