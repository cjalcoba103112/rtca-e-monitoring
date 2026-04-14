import type { Personnel } from "../Personnel";

export interface ActivityData {
  activity: string;
  personnel: number;
  info: NameDTO[];
}

export interface NameDTO{
    name :Personnel;
    startDate?:string;
    endDate?:string;
    title?:string
}