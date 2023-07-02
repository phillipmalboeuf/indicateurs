import type { TypeNavigationSkeleton } from '$lib/clients/content_types.js'
import { contentful, entry } from '$lib/clients/contentful'

export async function load({ params }) {
	const locale = params.locale
	const [principale, secondaire, tertiaire, logo] = await Promise.all([
    entry<TypeNavigationSkeleton>('cYD1Ubzf7Lpf7lwJuQuBT', locale),
    entry<TypeNavigationSkeleton>('3oqVtIoSuKLGafP82eHjhs', locale),
    entry<TypeNavigationSkeleton>('5Tp2oC9lSsUrjzxJUqBolq', locale),
    contentful.getAsset('6RgOLhZuwpchQqhTPk8Huu')
  ])


  return {
		principale,
		secondaire,
		tertiaire,
		logo
		// sousNavigation,
		// contact
	}
}
