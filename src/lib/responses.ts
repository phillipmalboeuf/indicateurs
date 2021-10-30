import type { LoadInput } from '@sveltejs/kit';

export async function respond(fetch: LoadInput['fetch'], url: string) {
  const res = await fetch(url)

  if (res.ok) {
    return {
      props: await res.json()
    }
  }

  return {
    status: res.status,
    error: new Error(`Could not load ${url}`)
  }
}