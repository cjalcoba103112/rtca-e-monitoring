export default function formattedPeso(pesoValue: number) {
  const rawFormatted = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(pesoValue);

  return rawFormatted.replace(/\u00a0/g, ' ');
}

export function formattedPesoNoSign(pesoValue: number) {
  const rawFormatted = new Intl.NumberFormat('en-PH', {
    style: 'currency',
  }).format(pesoValue);

  return rawFormatted.replace(/\u00a0/g, ' ');
}