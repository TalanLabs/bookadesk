import { NotAuthorizedError } from "../domain/errors";
import { ConnectedUser } from "../domain/domain";
import { OfficeRepo } from "./ports/OfficeRepo";

/**
 * Delete a place
 * @throws NotAuthorizedError if user is not authorized
 */
export const deletePlace = async (
  placeId: string,
  connectedUser: ConnectedUser,
  officeRepo: OfficeRepo
): Promise<void> => {
  if (!connectedUser.isAdmin) {
    throw new NotAuthorizedError();
  }
  await officeRepo.deletePlace(placeId);
};
