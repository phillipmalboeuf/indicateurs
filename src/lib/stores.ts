import { writable } from 'svelte/store'

export const region = writable<string[]>(["Québec", "Canada"])

export const colors = {
  'Canada': '#EF3340',
  'Québec': '#3979d8',
  'Ontario': '#FFF'
}