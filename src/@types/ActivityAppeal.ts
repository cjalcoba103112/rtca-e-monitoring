import type { PersonnelActivity } from "./PersonnelActivity";

export type ActivityAppeal = {
    id?: number | null;
    personnelActivityId?: number | null;
    personnelActivity?: PersonnelActivity | null;
    appealToken?: string | null;
    isUsed?: boolean | null;
    expiryDate?: string | Date; 
    createdAt?: string | Date | null;
    remarks?: string | null;
    disapprovedRoleName?: string | null;
    appealTargetRoleName?:string | null
};