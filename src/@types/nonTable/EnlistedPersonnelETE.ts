import type { Personnel } from "../Personnel";

export type EnlistedPersonnelETE = {
  yearsInService?: number;
  dateOfLatestReEnlistment?: Date;
  nextETE?: Date;
  remarks?: string;
  eteDaysRemaining?:number
} & Personnel;
