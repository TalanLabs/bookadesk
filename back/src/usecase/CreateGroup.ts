import {GroupRepo} from "./ports/GroupRepo";

export const createGroup = async (name: string, groupRepo: GroupRepo): Promise<string> => {
    return groupRepo.create(name);
}