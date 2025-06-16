import { slugify } from 'transliteration';

export function slugifyWithApostrophe(text: string): string {
  if (!text) return 'product';
  const replaced = text.replace(/'/g, '');
  let slug = slugify(replaced);
  return slug;
}
