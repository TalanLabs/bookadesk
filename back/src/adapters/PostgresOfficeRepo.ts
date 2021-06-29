import { Client, QueryResult } from "pg";

import { OfficeRepo } from "../usecase/ports/OfficeRepo";
import { Floor, Office, Place } from "../domain/domain";

interface DbPlace {
  id: string;
  num: string;
  office_id: string;
  floor_id: string;
  room: string;
  left_pos: number;
  top_pos: number;
  neighbours: string[];
  group_id: string;
}

interface DbOffice {
  id: string;
  name: string;
  description: string;
}

interface DbFloor {
  id: string;
  name: string;
  places: Place[];
}

export class PostgresOfficeRepo implements OfficeRepo {
  private pgClient: Client;

  constructor(pgClient: Client) {
    this.pgClient = pgClient;
  }

  async getOffices(): Promise<Office[]> {
    const q = "SELECT * FROM offices";
    try {
      const res = await this.pgClient.query(q);
      return res.rows.map(r => PostgresOfficeRepo.officeFromDb(r));
    } catch (err) {
      console.error("failed to get office information", err.stack);
      return err;
    }
  }

  async getOffice(officeId: string): Promise<Office> {
    if (!officeId) {
      throw new Error(`Can not get office: empty office ID`);
    }

    const text = "SELECT * FROM offices WHERE offices.id= $1 ";
    const values = [officeId];
    let res: QueryResult<DbOffice>;
    try {
      res = await this.pgClient.query(text, values);
    } catch (err) {
      console.error("failed to get office information", err.stack);
      throw err;
    }
    if (res.rows.length == 0) {
      throw new Error(`Office not found ${officeId}`);
    }
    const office = PostgresOfficeRepo.officeFromDb(res.rows[0]);

    const floors = await this.getFloorsByOfficeId(officeId);
    if (floors.length == 0) {
      return Promise.resolve(office);
    }

    office.floors = floors;
    return Promise.resolve(office);
  }

  private async officeExists(officeId: string): Promise<boolean> {
    const query = "select exists(select 1 from offices where id=$1)";
    const res = await this.pgClient.query(query, [officeId]);
    return res.rows[0].exists;
  }

  private async placeExists(placeId: string): Promise<boolean> {
    const query = "select exists(select 1 from places where id=$1)";
    const res = await this.pgClient.query(query, [placeId]);
    return res.rows[0].exists;
  }

  async updatePlaces(
    places: Place[],
    officeId: string,
    floorId: string
  ): Promise<void> {
    await Promise.all(
      places.map(async p => {
        const exists = await this.placeExists(p.id);
        console.log("place", p.id, "exists", exists);
        if (exists) {
          return this.updatePlace(p, floorId, officeId);
        } else {
          return this.insertPlace(p, floorId, officeId);
        }
      })
    );
  }

  // FIXME Maybe we could replace this with two separate methods. Should accept only one office in param
  async createOrUpdateOffices(
    offices: Office[],
    saveFloors: boolean
  ): Promise<void> {
    const promises = offices.map(async o => {
      const exists = await this.officeExists(o.id);
      if (exists) {
        await this.updateOffice(o);
      } else {
        await this.createOffice(o);
      }
      if (saveFloors) {
        const floorPromises = o.floors.map(f =>
          this.createOrUpdateFloor(f, o.id)
        );
        return Promise.all(floorPromises);
      }
    });
    await Promise.all(promises);
  }

  async createOffice(office: Office): Promise<void> {
    const text =
      "INSERT INTO offices(id, name, description) VALUES($1, $2, $3) RETURNING *";
    const values = [office.id, office.name, office.description];
    try {
      await this.pgClient.query(text, values);
    } catch (err) {
      console.error("failed to add office", err.stack);
    }
  }

  async updateOffice(office: Office): Promise<void> {
    const text =
      "UPDATE offices SET name = $2, description = $3 WHERE id=$1 RETURNING *";
    const values = [office.id, office.name, office.description];
    try {
      await this.pgClient.query(text, values);
    } catch (err) {
      console.error("failed to update office", err.stack);
    }
  }

  async updateFloorName(
    officeId: string,
    floorId: string,
    floorName: string
  ): Promise<void> {
    const text = "UPDATE floors SET name = $2 WHERE id=$1 and office_id=$3";
    const values = [floorId, floorName, officeId];
    try {
      await this.pgClient.query(text, values);
    } catch (err) {
      console.error("failed to update office", err.stack);
    }
  }

  private async createFloor(f: Floor, officeId: string): Promise<void> {
    const q =
      "INSERT INTO floors(id, name , office_id) VALUES($1, $2, $3) RETURNING *";
    const values = [f.id, f.name, officeId];
    try {
      await this.pgClient.query(q, values);
    } catch (err) {
      console.error("failed to add floor", err.stack);
    }
  }

  private async createOrUpdateFloor(f: Floor, officeId: string) {
    const exists = await this.floorExists(f.id);
    if (exists) {
      return this.updateFloor(f, officeId);
    } else {
      return this.createFloor(f, officeId);
    }
  }

  private async floorExists(id: string): Promise<boolean> {
    const query = "select exists(select 1 from floors where id=$1)";
    const res = await this.pgClient.query(query, [id]);
    return res.rows[0].exists;
  }

  async updateFloor(floor: Floor, officeId: string): Promise<void> {
    const text =
      "UPDATE floors SET name = $2, office_id = $3 WHERE id=$1 RETURNING *";
    const values = [floor.id, floor.name, officeId];
    try {
      await this.pgClient.query(text, values);
    } catch (err) {
      console.error("failed to update office", err.stack);
    }
  }

  async getFloorsByOfficeId(officeId: string): Promise<Floor[]> {
    const text = "SELECT * FROM floors WHERE floors.office_id= $1";
    const values = [officeId];
    try {
      const res = await this.pgClient.query(text, values);
      return res.rows.map(r => PostgresOfficeRepo.floorFromDb(r));
    } catch (err) {
      console.error("failed to get floor places", err.stack);
    }
  }

  async getFloorPlaces(floorId: string): Promise<Place[]> {
    const text = "SELECT *  FROM places WHERE floor_id = $1 ORDER BY num";
    const values = [floorId];
    try {
      const res = await this.pgClient.query(text, values);
      return res.rows.map(r => PostgresOfficeRepo.placeFromDb(r));
    } catch (err) {
      console.error("failed to get floor places", err.stack);
    }
  }

  private async insertPlace(
    place: Place,
    floorId: string,
    officeId: string
  ): Promise<void> {
    console.log("insert place", place);
    const text =
      "INSERT INTO places(id, num, floor_id, office_id, room, left_pos, top_pos) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [
      place.id,
      place.number,
      floorId,
      officeId,
      place.room,
      place.position.left,
      place.position.top
    ];
    try {
      await this.pgClient.query(text, values);
    } catch (err) {
      console.error("failed to add place", err.stack);
    }
  }

  private async updatePlace(
    place: Place,
    floorId: string,
    officeId: string
  ): Promise<void> {
    const text =
      "UPDATE places SET num=$2, floor_id=$3, office_id=$4, room=$5, left_pos=$6, top_pos= $7 where id=$1";
    const values = [
      place.id,
      place.number,
      floorId,
      officeId,
      place.room,
      place.position.left,
      place.position.top
    ];
    try {
      await this.pgClient.query(text, values);
    } catch (err) {
      console.error("failed to udpate place", err.stack);
    }
  }

  private static placeFromDb(dbPlace: DbPlace): Place {
    return {
      id: dbPlace.id,
      room: dbPlace.room,
      number: dbPlace.num,
      position: {
        left: parseFloat(dbPlace.left_pos.toString()),
        top: parseFloat(dbPlace.top_pos.toString())
      },
      officeId: dbPlace.office_id,
      floorId: dbPlace.floor_id
    };
  }

  async getPlace(placeId: string): Promise<Place> {
    try {
      const res = await this.pgClient.query(
        "SELECT * FROM places WHERE id = $1;",
        [placeId]
      );
      return PostgresOfficeRepo.placeFromDb(res.rows[0]);
    } catch (e) {
      console.error("failed to get place", e);
    }
  }

  private static officeFromDb(dbOffice: DbOffice): Office {
    return {
      id: dbOffice.id,
      name: dbOffice.name,
      description: dbOffice.description,
      floors: []
    };
  }

  private static floorFromDb(dbFloor: DbFloor): Floor {
    return {
      id: dbFloor.id,
      name: dbFloor.name
    };
  }
}
