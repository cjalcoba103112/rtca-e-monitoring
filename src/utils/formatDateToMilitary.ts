// utils/formatDateToMilitary.ts
export const formatDateToMilitary = (dateInput?: Date | string | null): string => {
  if(!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) return ""; // invalid date

  const day = date.getDate().toString().padStart(2, "0");

  // Short month names in uppercase
  const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const month = monthNames[date.getMonth()];

  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};