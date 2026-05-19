
export default function getOrdinalSuffix(num: number): string {
  const absNum = Math.abs(Math.floor(num));
  
  const remainder100 = absNum % 100;
  if (remainder100 >= 11 && remainder100 <= 13) {
    return `${num}th`;
  }

  // Standard rule based on the last digit
  switch (absNum % 10) {
    case 1:  return `${num}st`;
    case 2:  return `${num}nd`;
    case 3:  return `${num}rd`;
    default: return `${num}th`;
  }
}