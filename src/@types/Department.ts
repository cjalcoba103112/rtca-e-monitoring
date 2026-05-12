import type { Personnel } from "./Personnel";

export type Department = {
	departmentId?: number;
	departmentName?: string;
	location?: string;
	oicId?: number;
	oic?: Personnel;

};