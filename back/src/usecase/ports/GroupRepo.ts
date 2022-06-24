import { Group } from "../../domain/domain";

export interface GroupRepo {
  create(name: string): Promise<string>;
  list(): Promise<Group[]>;
}
