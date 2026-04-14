import React from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import type { PersonnelActivity } from "../../@types/PersonnelActivity";

import ApprovalLeave from "./ApprovalLeave";

dayjs.extend(isBetween);

export const emptyValues: PersonnelActivity = {
  personnelActivityId: null,
  personnelId: null,
  personnel: null,
  activityTypeId: null,
  activityType: null,
  title: null,
  startDate: null,
  endDate: null,
  status: "Pending",
  result: null,
  remarks: null,
};

const PersonnelActivityIndex: React.FC = () => {
 return(
  <ApprovalLeave/>
 )
};

export default PersonnelActivityIndex;
