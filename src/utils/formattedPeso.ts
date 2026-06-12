

export default function formattedPeso(pesoValue: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(pesoValue);
}


