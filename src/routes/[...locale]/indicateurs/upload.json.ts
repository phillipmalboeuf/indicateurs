import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'
import { decode } from 'base64-arraybuffer'

import axios from 'axios'
import { createHash } from 'crypto'

// @ts-ignore
export const put: RequestHandler = async ({ params, query, body }) => {

  const image = Buffer.from(body.toString().replace('data:image/png;base64,', ''), 'base64')

  const hash = createHash('sha256')
  hash.update(image)
  const check = hash.digest('hex').toUpperCase()

  await fetch(`https://api.imgix.com/api/v1/purge`, {
    method: 'POST',
    body: JSON.stringify({ data: {
      attributes: { url: `https://indicateurs.imgix.net/${query.get("name")}.png` }
    } }),
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_IMGIX_PURGE_KEY}`,
      'Content-Type': 'application/vnd.api+json'
    }})


  const response = await fetch(`https://ny.storage.bunnycdn.com/indicateurs/${query.get("name")}.png`, {
    method: 'PUT',
    body: image,
    headers: {
      'Checksum': check,
      'Content-Type': 'image/png',
      'AccessKey': import.meta.env.VITE_BUNNY_KEY as string
    }})

  return {
    body: await response.json()
  }
}