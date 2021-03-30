import { OfficeRepo } from "./ports/OfficeRepo";
import { Office } from "../domain/domain";

export const getOffice = async (
  officeId: string,
  officeRepo: OfficeRepo
): Promise<Office> => {
  return officeRepo.getOffice(officeId);
};
