import { browser } from '$app/environment'
import { writable } from 'svelte/store'

export const region = writable<string[]>(["Québec", "Canada"])

if (browser) {
  if (localStorage.getItem('regions')) { region.set(JSON.parse(localStorage.getItem('regions'))) }
  region.subscribe(regions => localStorage.setItem('regions', JSON.stringify(regions)))
}

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

export const extraRegions = {
  'France': '#FFFFFF',
  // 'Ontario': '#CF142B',
  'Allemagne': '#DD0000',
  'Islande': "#02529C",
  'Italie': "#CE2B37",
  'Royaume-Uni': "#CF142B",
  'États-Unis': "#3C3B6E",
  'Japon': '#FFFFFF',
  'Nouvelle-Zélande': '#CC142B',
  'Finlande': '#FFF'
}

export const table = {
  "Juridictions": ["Québec", "Ontario", "Canada"],
  "G7": ["Allemagne", "France", "Italie"],
  "&nbsp;": ["Royaume-Uni", "Japon", "États-Unis"],
  "WEGo": ["Finlande", "Islande", "Nouvelle-Zélande"]
}

export const regionsEnglish = {
  'Québec': 'Quebec',
  'Ontario': 'Ontario',
  'Canada': 'Canada',
  'Allemagne': 'Germany',
  'France': 'France',
  'Italie': 'Italy',
  'Royaume-Uni': 'United Kingdom',
  'Japon': 'Japan',
  'États-Unis': 'United States',
  'Finlande': 'Finland',
  'Islande': 'Iceland',
  'Nouvelle-Zélande': 'New Zealand',
}

export const links = {
  "G7": "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/g7/index.aspx?lang=fra",
  "WEGo": "https://weall.org/hubs",
}