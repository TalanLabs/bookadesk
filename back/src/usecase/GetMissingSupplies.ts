import { MissingSupply } from "../domain/domain";
import { SuppliesRepo } from "./ports/SuppliesRepo";

export const getMissingSupplies = async (
  officeId: string,
  supplyRepo: SuppliesRepo
): Promise<MissingSupply[]> => {
  return supplyRepo.getMissingSupplies(officeId);
};
