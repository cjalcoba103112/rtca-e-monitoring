import type { Personnel } from "../@types/Personnel";

export default function nameFormat(personnel?:Personnel | null ){
  if(!personnel) return "";
  return `${personnel?.rank?.rankCode} ${personnel?.firstName} ${personnel?.middleName} ${personnel?.lastName} ${personnel?.serialNumber} PCG`
}