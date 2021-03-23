import {Office} from '../domain/domain';
import {OfficeRepo} from './ports/OfficeRepo';

export const createOrUpdateOffices = async (
    offices: Office[],
    officeRepo: OfficeRepo
): Promise<void> => {
    await officeRepo.createOrUpdateOffices(offices, true);
};
