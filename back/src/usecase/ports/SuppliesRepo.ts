import { MissingSupply } from "../../domain/domain";

export interface SuppliesRepo {
  addMissingSupply(missingSupply: MissingSupply): Promise<void>;
  getMissingSupplies(officeId: string): Promise<MissingSupply[]>;
}
