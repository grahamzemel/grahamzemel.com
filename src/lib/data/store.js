import { writable } from 'svelte/store'

export const prefersReducedMotion = writable(false)
export const theme = writable("dark")