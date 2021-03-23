import { OfficeRepo } from "./ports/OfficeRepo";
import { Office } from "../domain/domain";

export const getOffices = async (officeRepo: OfficeRepo): Promise<Office[]> => {
  const offices = await officeRepo.getOffices();
  return offices;
};
