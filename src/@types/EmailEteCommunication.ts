import type { Personnel } from "./Personnel";

export type EmailEteCommunication = {
	id?: number | null;
	personnelId?: number | null;
	personnel?:Personnel|null,
	emailCategory?: string | null;
	nextEte?: Date | null;
	communicationToken?: string | null;
	sentDateTime?: Date | null;
	expiryDateTime?: Date | null;
	isAccessed?: boolean | null;
	accessedDateTime?: Date | null;
	response?: string | null;
	responseDateTime?: Date | null;
	remarks?: string | null;
	remainingDays?:number|null
};