import type { Personnel } from "../Personnel";

export interface DepartmentActivityData {
  department: string;
  activity: string;
  personnel: number;
  names: Personnel[];
}