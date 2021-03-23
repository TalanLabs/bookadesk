import { MissingSupply } from "../domain/domain";
import { SuppliesRepo } from "./ports/SuppliesRepo";

export const notifyMissingSupplies = async (
  missingSupply: MissingSupply,
  supplyRepo: SuppliesRepo
) => {
  await supplyRepo.addMissingSupply(missingSupply);
};
