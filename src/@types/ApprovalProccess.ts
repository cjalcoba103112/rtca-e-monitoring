import type { Personnel } from "./Personnel";

export type ApprovalProccess = {
	id?: number;
	currentStage?: number;
	stageOneId?: number;
	stageOneRemarks?: string;
	stageOneIsApprove?: boolean;
	approverOne?: Personnel;

	stageTwoId?: number;
	stageTwoRemarks?: string;
	stageTwoIsApprove?: boolean;
	approverTwo?: Personnel;

	stageThreeId?: number;
	stageThreeRemarks?: string;
	stageThreeIsApprove?: boolean;
	approverThree?: Personnel;

	stageFourId?: number;
	stageFourRemarks?: string;
	stageFourIsApprove?: boolean;
	approverFour?: Personnel;

};