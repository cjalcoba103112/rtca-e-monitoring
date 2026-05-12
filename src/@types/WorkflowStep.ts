import type { RankCategory } from "./RankCategory";
import type { Role } from "./Role";

export type WorkflowStep = {
    id?: number | null;
    rankCategoryId?: number | null;
    rankCategory?:RankCategory;
    stepNumber?: number | null;
    roleId?: number | null;
    role?:Role | null;
};