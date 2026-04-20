import type { Personnel } from "./Personnel";

export type PersonnelDutyLogs= {
    id?: number | null;
    personnelId?: number | null;
    personnel?: Personnel;
    status?: string;
    startDate?: Date;
    endDate?: Date | null;
    remarks?: string;
    isActive?: boolean;
}