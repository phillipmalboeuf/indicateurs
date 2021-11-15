import { contentful, entry } from '$lib/clients/contentful';

export async function get({ params }) {
  const locale = params.locale
	const [principale, secondaire, tertiaire] = await Promise.all([
    entry('cYD1Ubzf7Lpf7lwJuQuBT', locale),
    entry('3oqVtIoSuKLGafP82eHjhs', locale),
    entry('5Tp2oC9lSsUrjzxJUqBolq', locale)
  ])


  return {
    body: {
      principale,
      secondaire,
      tertiaire
      // sousNavigation,
      // contact
    }
  }
}