/* eslint-disable @typescript-eslint/no-unused-vars */
import { OfficeRepo } from "../usecase/ports/OfficeRepo";
import { Office, Place } from "../domain/domain";

export class InMemoryOfficeRepo implements OfficeRepo {
  offices: Office[] = [
    {
      id: "paris_office",
      name: "Paris office",
      floors: [
        {
          id: "first_floor",
          name: "First Floor"
        }
      ]
    }
  ];
  places: Place[] = [
    {
      id: "place_1",
      officeId: "paris_office",
      floorId: "first_floor",
      number: "1",
      position: {
        left: 1,
        top: 1
      }
    },
    {
      id: "place_2",
      officeId: "paris_office",
      floorId: "first_floor",
      number: "2",
      position: {
        left: 1,
        top: 1
      }
    }
  ];

  createOrUpdateOffices(offices: Office[], saveFloors: boolean): Promise<void> {
    throw Error("Not implemented!");
  }

  getFloorPlaces(floorId: string): Promise<Place[]> {
    const places = this.places.filter(p => p.floorId === floorId);
    return Promise.resolve(places);
  }

  getOffice(officeId: string): Promise<Office> {
    const office = this.offices.find(o => o.id === officeId);
    if (!office) {
      throw new Error(`Could not find office ${officeId}`);
    }
    return Promise.resolve(office);
  }

  getOffices(): Promise<Office[]> {
    throw Error("Not implemented!");
  }

  getPlace(placeId: string): Promise<Place> {
    throw Error("Not implemented!");
  }

  updateFloorName(
    officeId: string,
    floorId: string,
    floorName: string
  ): Promise<void> {
    throw Error("Not implemented!");
  }

  updatePlaces(
    places: Place[],
    officeId: string,
    floorId: string
  ): Promise<void> {
    throw Error("Not implemented!");
  }
}
