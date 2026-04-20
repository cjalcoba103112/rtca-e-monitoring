export const getDutyStatusColor = (status?: string | null) => {
    switch (status?.toLowerCase()) {
        case "active": return "green";
        case "restricted": return "gold";
        case "reassigned": return "blue";
        case "suspended": return "red";
        default: return "default";
    }
};