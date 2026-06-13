import type { Rank } from "../Rank";

export type PersonnelLongevityPay = {
    personnelId?: number;
    profile?: string;
    serialNumber?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    rankId?: number;
    rank?: Rank; 
    dateEnteredService?: string; 
    yearsOfService?: number;
    percentage?: number;
    longevityPay?: number;
    totalAmount?: number;
};