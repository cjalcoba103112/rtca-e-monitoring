
export const formatDaysToYMD = (totalDays: number | undefined | null): string => {
    if (!totalDays || totalDays <= 0) return "0 Days";

    const years = Math.floor(totalDays / 365);
    const remainingDaysAfterYears = totalDays % 365;
    
    const months = Math.floor(remainingDaysAfterYears / 30);
    const days = remainingDaysAfterYears % 30;

    const parts: string[] = [];

    if (years > 0) {
        parts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
    }
    
    if (months > 0) {
        parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
    }
    
    if (days > 0) {
        parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);
    }

    return parts.length > 0 ? parts.join(", ") : "0 Days";
};