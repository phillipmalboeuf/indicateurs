import type { TypeNavigationSkeleton, TypeSystemSkeleton } from '$lib/clients/content_types.js'
import { content, entry } from '$lib/clients/contentful'

export async function load({ params }) {
	const [principale, secondaire, tertiaire, system] = await Promise.all([
    entry<TypeNavigationSkeleton>('cYD1Ubzf7Lpf7lwJuQuBT'),
    entry<TypeNavigationSkeleton>('3oqVtIoSuKLGafP82eHjhs'),
    entry<TypeNavigationSkeleton>('5Tp2oC9lSsUrjzxJUqBolq'),
		entry<TypeSystemSkeleton>('3qLoiQqZxJNss30lTE0mdA', { select: 'fields.alert', content_type: 'system' }),
    // content.getAsset('6RgOLhZuwpchQqhTPk8Huu')
  ])

  return {
		principale,
		secondaire,
		tertiaire,
		alert: system.fields.alert,
		// logo
		// sousNavigation,
		// contact
	}
}
