import {GroupRepo} from "./ports/GroupRepo";

export const CreateGroup = async (name: string, groupRepo: GroupRepo): Promise<string> => {
    return groupRepo.create(name);
}