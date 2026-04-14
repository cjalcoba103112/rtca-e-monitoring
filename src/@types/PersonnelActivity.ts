import type { ActivityType } from "./ActivityType";
import type { Personnel } from "./Personnel";

export type PersonnelActivity = {
  personnelActivityId?: number | null;
  personnelId?: number | null;
  personnel?: Personnel | null;
  activityTypeId?: number | null;
  activityType?: ActivityType | null;
  title?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  result?: string | null;
  remarks?: string | null;
  days?: number | null;
  reason?: string | null;
};
