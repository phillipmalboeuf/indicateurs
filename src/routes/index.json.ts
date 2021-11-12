import { contentful, entries } from '$lib/clients/contentful'
import type { RequestHandler } from '@sveltejs/kit'
import type { Entry } from 'contentful'

export const ids = [
  'revenu-disponible-par-habitant-apres-impots',
  'taux-de-chomage-des-15-ans-et-plus',
  'taux-demploi-des-25-a-54-ans',
  'produit-interieur-brut-par-habitant-usd-enchaines-de-2012',
  'productivite-au-travail-enchaines-de-2012-par-heure',
  'depenses-publiques-et-privees-en-recherche-et-developpement-du-pib',
  'sous-utilisation-de-la-main-doeuvre-en-de-la-population-active',
  'investissement-en-capital-x-1-000-000-usd-constants',
  'travail-involontaire-a-temps-partiel',
  'travail-a-statut-temporaire',
  'qualite-de-lemploi-travailleurs-salaries-non-etudiants-x-1000',
  'jeunes-de-15-a-24-ans-qui-ne-sont-ni-aux-etudes-ni-a-lemploi-ni-en-formation',
  'competences-des-enfants-des-etudiants-et-des-adultes-pisa',
  'competences-des-enfants-des-etudiants-et-des-adultes-peica',
  'proportion-de-la-population-ayant-un-diplome-etudes-post-secondaires',
  'dette-nette-pib',
  'dette-des-menages-en-proportion-du-revenu-disponible',
  'creation-dentreprises-nombre-dentreprises-actives-avec-employes',
  'economie-sociale-au-quebec',
  'indice-entrepreneurial-collectif-quebecois',
  
  'nombre-de-menages-ayant-des-besoins-imperieux-en-matiere-de-logement',
  'taux-dinoccupation-des-logements',
  'personnes-a-faible-revenu-selon-la-mesure-du-panier-de-consommation-mpc',
  'personnes-a-faible-revenu-selon-la-mesure-de-faible-revenu-mfr',
  'menages-en-situation-de-securite-alimentaire',
  'indice-de-la-gravite-de-la-criminalite-100-2006',
  'esperance-de-vie-a-la-naissance-hommes-et-femmes-annees',
  'sante-mentale-percue-pour-les-12-ans-et-plus-percue-tres-bonne-ou-excellente',
  'coefficient-de-gini-en-fonction-du-revenu-ajuste-apres-impots',
  'indice-de-palma-en-fonction-du-revenu-ajuste-apres-impots',
  'elasticite-intergenerationnelle-des-revenus',
  'pib-de-la-culture-et-du-sport',
  'integration-economique-des-immigrants',
  'ecart-salarial-hommes-femmes-remuneration-en-dollars-par-semaine',
  'ecart-du-taux-demploi-hommes-femmes',
  'ecart-du-taux-demploi-autochtones-allochtones',
  'enfants-de-0-a-12-ans-dont-la-mere-a-un-emploi',
  'personnes-de-15-ans-et-plus-utilisant-internet-a-des-fins-personnelles',
  'appui-a-la-mission-globale-des-organismes-communautaires',
  'qualite-du-systeme-de-garderie',
  'engagement-communautaire-et-implication-benevole',
  'itinerance-a-lechelle-du-quebec',
  'sante-environnementale',
  'vitalite-des-langues-autochtones-parlees-au-quebec',

  'qualite-de-lair',
  'moyenne-annuelle-du-nombre-de-jours-de-mauvaise-qualite-de-lair',

  'emissions-de-gaz-a-effet-de-serre',
  'aires-protegees',
  'eau-potable',
  'transport-collectif',
  'especes-menacees-vulnerables-et-exotiques-envahissantes',
  'eaux-usees-des-ouvrages-municipaux-respectant-les-standards-en-matiere',
  'matieres-residuelles-recuperees',
  'acces-a-un-parc-ou-un-espace-vert-pres-de-la-maison',
  'part-de-sources-renouvelables-dans-lenergie-primaire-consommee',
  'efficacite-energetique',
  'vehicules-en-circulation-sur-les-routes',
  'indice-de-circularite-de-leconomie',
  'pib-vert-du-pib-dedie-aux-produits-environnementaux-et-aux-technologies',

  'superficie-du-territoire-municipalise',
  
  'part-modale-des-modes-de-mobilite-durable',
  'capacite-de-sequestration-de-carbone-du-quebec',
  'adaptation-aux-changements-climatiques-du-quebec',
  'total-des-catastrophes-naturelles-et-urgences-au-quebec',
  'budget-adaptation-aux-changements-climatiques',
  'indice-dartificialisation-mineralisation-des-sols-a-lechelle-du-quebec',
  'trajets-de-longue-duree-en-automobile-pour-se-rendre-au-travail',
  'indice-des-especes-au-quebec',
  'budget-en-matiere-de-biodiversite',
  'indice-devolution-des-ecosystemes'
]


// @ts-ignore
export const get: RequestHandler = async ({ params, query }) => {
  const locale = query.get('locale')
	const [page, categories, indicateurs] = await Promise.all([
    contentful.getEntry('5nm4pR4zIs8IhngVKfeSlk', { include: 2 }),
    entries('categorie', locale),
    entries<{ id: string, categorie: Entry<{ id: string }> }>('indicateur', locale)
  ])

  return {
    body: {
      page,
      categories,
      indicateurs: ids.map(id => indicateurs.find(i => i.fields.id === id)).filter(i => i)
    }
  }
}