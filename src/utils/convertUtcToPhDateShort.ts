// utils/date.ts
export function convertUtcToPhDateShort(utcDateString?: string): string {
  if (!utcDateString) return "";

 if (!utcDateString) return "";

  // Parse UTC date
  const utcDate = new Date(utcDateString);

  // Convert to Philippine Time (UTC+8)
  const phTime = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);

  // Get day, month, year separately
  const day = String(phTime.getDate()).padStart(2, "0");

  // Month as short string in uppercase
  const month = phTime.toLocaleString("en-US", { month: "short" }).toUpperCase();

  const year = phTime.getFullYear();

  return `${day} ${month} ${year}`;
}