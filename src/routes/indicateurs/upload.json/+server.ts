import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

import { createHash } from 'crypto'

export const PUT: RequestHandler = async ({ request, url }) => {
  const body = await request.text()
  const image = Buffer.from(body.replace('data:image/png;base64,', ''), 'base64')

  const hash = createHash('sha256')
  hash.update(new Uint8Array(image))
  const check = hash.digest('hex').toUpperCase()

  await fetch(`https://api.imgix.com/api/v1/purge`, {
    method: 'POST',
    body: JSON.stringify({ data: {
      attributes: { url: `https://indicateurs.imgix.net/${url.searchParams.get("name")}.png` }
    } }),
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_IMGIX_PURGE_KEY}`,
      'Content-Type': 'application/vnd.api+json'
    }})

  const response = await fetch(`https://ny.storage.bunnycdn.com/indicateurs/${url.searchParams.get("name")}.png`, {
    method: 'PUT',
    body: image,
    headers: {
      'Checksum': check,
      'Content-Type': 'image/png',
      'AccessKey': import.meta.env.VITE_BUNNY_KEY as string
    }})

  return new Response(JSON.stringify(await response.json()))
}