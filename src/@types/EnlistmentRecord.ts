export type EnlistmentRecord = {
  enlistmentId?: null | number;
  personnelId?: null | number;

  enlistmentStart?: null | Date;
  enlistmentEnd?: null | string;

  contractYears?: null | number;

  status?:
    | "ACTIVE"
    | "COMPLETED"
    | "REENLISTED"
    | "SEPARATED"
    | "ALREADY SUBMITTED";

  reenlistmentFlag?: null | boolean;

  remarks?: null | string;

  createdAt?: null | string;
};
