import { writable } from 'svelte/store'

export const region = writable<string[]>(["Québec", "Canada"])

export const regions = {
  'Québec': '#3979d8',
  'Ontario': '#F3CC00',
  'Canada': '#FF0000',
  'Allemagne': '#FFCE00',
  'France': '#002395',
  'Italie': '#009246',
  'Royaume-Uni': '#FFF',
  'Japon': '#BC002D',
  'États-Unis': '#B22234',
  'Finlande': '#003580',
  'Islande': '#DC1E35',
  'Nouvelle-Zélande': '#00247D',
}