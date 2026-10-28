export const DEFAULT_CATEGORIES = [
  { key: 'clothing', label: 'Clothing' },
  { key: 'footwear', label: 'Footwear' },
  { key: 'bags', label: 'Bags' },
  { key: 'jewelry', label: 'Jewelry & Accs' },
];

export function categoryKeyFromLabel(label) {
  return label
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
