import { contentful } from '$lib/clients/contentful';

export async function get({ params }) {

	const [principale, secondaire, tertiaire] = await Promise.all([
    contentful.getEntry('cYD1Ubzf7Lpf7lwJuQuBT', { include: 2 }),
    contentful.getEntry('3oqVtIoSuKLGafP82eHjhs', { include: 2 }),
    contentful.getEntry('5Tp2oC9lSsUrjzxJUqBolq')
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