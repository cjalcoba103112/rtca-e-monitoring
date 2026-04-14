import type { Personnel } from "../Personnel";

export interface DepartmentData {
  department?: string;
  personnel: number;
  names: Personnel[];
}