import slugifyLib from 'slugify'
export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: 'es', trim: true })
}
export function uniqueSlug(text: string): string {
  const base = slugify(text)
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}
