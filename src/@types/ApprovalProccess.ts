import type { Personnel } from "./Personnel";

export type ApprovalProccess = {
	id?: number | null;
	cmaaId?: number | null;
	cmaa?:Personnel | null;
	cmaaRemarks?: string | null;
	cmaaIsApprove?: boolean | null;
	oicId?: number | null;
	oicRemarks?: string | null;
	oicIsApprove?: boolean | null;
	oic?:Personnel;
	csgId?: number | null;
	csgRemarks?: string | null;
	csgIsApprove?: boolean | null;
	csg?:Personnel | null;
	coId?: number | null;
	coRemarks?: string | null;
	coIsApprove?: boolean| null;
	co?:Personnel
	currentStage?: 1 | 2 | 3 | 4
};