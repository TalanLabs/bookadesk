import * as fs from 'fs'
import _ from 'lodash'

import { OfficeRepo } from '../usecase/ports/OfficeRepo'
import { Floor, Office, Place } from '../domain/domain'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

interface DbOffice {
  id: string
  name: string
  description: string
}

interface DbFloor {
  id: string
  name: string
  officeId: string
}

interface DbPlace {
  id: string
  number: string
  officeId: string
  floorId: string
  room: string
  left: number
  top: number
}

export class DynamoDbOfficeRepo implements OfficeRepo {
  private documentClient: DocumentClient
  private readonly officesTableName: string
  private readonly floorsTableName: string
  private readonly placesTableName: string

  constructor(documentClient: DocumentClient, dbPrefix: string) {
    this.documentClient = documentClient
    this.officesTableName = dbPrefix + 'Offices'
    this.floorsTableName = dbPrefix + 'Floors'
    this.placesTableName = dbPrefix + 'Places'
  }

  async getOffices(): Promise<Office[]> {
    try {
      const params = {
        TableName: this.officesTableName,
      };
      const dbOffices = (await this.documentClient.scan(params).promise())
        .Items as DbOffice[]
      return Promise.all(dbOffices.map((o) => this.officeFromDb(o, true)))
    } catch (e) {
      console.error('Failed to fetch office', e)
      throw new Error('Failed to fetch office')
    }
  }

  async getOffice(officeId: string): Promise<Office> {
    try {
      const params = {
        TableName: this.officesTableName,
        ExpressionAttributeValues: {
          ':f': officeId,
        },
        FilterExpression: 'id = :f',
      };
      const dbOffices = (await this.documentClient.scan(params).promise())
        .Items as DbOffice[]
      if (dbOffices.length !== 1) {
        throw new Error(`Should get one element with id ${officeId}`)
      }
      return this.officeFromDb(dbOffices[0], true)
    } catch (e) {
      console.error('Failed to fetch office', e)
      throw new Error('Failed to fetch office')
    }
  }

  async createOrUpdateOffices(
    offices: Office[],
    saveFloors: boolean,
  ): Promise<void> {
    try {
      if (offices.length > 0) {
        const params = {
          RequestItems: {
            [this.officesTableName]: offices.map((o) => {
              return {
                PutRequest: {
                  Item: this.officeToDb(o),
                },
              };
            }),
          },
        }

        await this.documentClient.batchWrite(params).promise()
        if (saveFloors) {
          offices.forEach((o) => this.createOrUpdateFloors(o.floors, o.id))
        }
      }
    } catch (e) {
      console.error('Failed to update office', e)
      throw new Error('Failed to update office')
    }
  }

  async createOrUpdateFloors(floors: Floor[], officeId: string): Promise<void> {
    try {
      if (floors.length > 0) {
        const params = {
          RequestItems: {
            [this.floorsTableName]: floors.map((f) => {
              return {
                PutRequest: {
                  Item: this.floorToDb(f, officeId),
                },
              };
            }),
          },
        }

        await this.documentClient.batchWrite(params).promise()
      }
    } catch (e) {
      console.error('Failed to update floor', e)
      throw new Error('Failed to update floor')
    }
  }

  async getFloorsByOffice(
    officeId: string,
    loadPlaces: boolean,
  ): Promise<Floor[]> {
    try {
      const params = {
        TableName: this.floorsTableName,
        ExpressionAttributeValues: {
          ':f': officeId,
        },
        FilterExpression: 'officeId = :f',
      }

      const promise = await this.documentClient.scan(params).promise()
      const dbFloors = promise.Items as DbFloor[]
      return Promise.all(dbFloors.map((p) => this.floorFromDb(p, loadPlaces)))
    } catch (e) {
      console.error('Failed to fetch floors', e)
      throw new Error('Failed to fetch floors')
    }
  }

  async getFloorPlaces(floorId: string): Promise<Place[]> {
    try {
      const params = {
        TableName: this.placesTableName,
        ExpressionAttributeValues: {
          ':f': floorId,
        },
        // ProjectionExpression: "#yr, title, info.rating",
        FilterExpression: 'floorId = :f',
      }

      const promise = await this.documentClient.scan(params).promise()
      const dbPlaces = promise.Items as DbPlace[]
      const places = dbPlaces.map((p) => this.placeFromDb(p))
      return _.sortBy(places, ['number'])
    } catch (e) {
      console.error('Failed to fetch places', e)
      throw new Error('Failed to fetch places')
    }
  }

  async updatePlaces(
    places: Place[],
    officeId: string,
    floorId: string,
  ): Promise<void> {
    await Promise.all(places.map((p) => this.updatePlace(p, floorId, officeId)))
  }

  private async updatePlace(
    place: Place,
    floorId: string,
    officeId: string,
  ): Promise<void> {
    try {
      const params = {
        TableName: this.placesTableName,
        Item: this.placeToDb(place, floorId, officeId),
      }

      await this.documentClient.put(params).promise()
    } catch (e) {
      console.error('Failed to update place', e)
      throw new Error('Failed to update place')
    }
  }

  private placeFromDb(dbPlace: DbPlace): Place {
    return {
      id: dbPlace.id,
      room: dbPlace.room,
      number: dbPlace.number,
      position: {
        left: dbPlace.left,
        top: dbPlace.top,
      },
    }
  }

  private placeToDb(p: Place, floorId: string, officeId?: string): DbPlace {
    return {
      id: p.id,
      room: p.room,
      number: p.number,
      left: p.position.left,
      top: p.position.top,
      floorId: floorId,
      officeId: officeId,
    }
  }

  private async officeFromDb(
    dbOffice: DbOffice,
    loadFloors: boolean = false,
  ): Promise<Office> {
    return {
      id: dbOffice.id,
      name: dbOffice.name,
      description: dbOffice.description,
      floors: loadFloors ? await this.getFloorsByOffice(dbOffice.id, true) : [],
    }
  }

  private officeToDb(o: Office): DbOffice {
    return {
      id: o.id,
      name: o.name,
      description: o.description,
    }
  }

  private async floorFromDb(
    dbFloor: DbFloor,
    loadPlaces: boolean = false,
  ): Promise<Floor> {
    return {
      id: dbFloor.id,
      name: dbFloor.name,
      places: loadPlaces ? await this.getFloorPlaces(dbFloor.id) : [],
    }
  }

  private floorToDb(f: Floor, officeId: string): DbFloor {
    return {
      id: f.id,
      name: f.name,
      officeId: officeId,
    }
  }

  async updateFloorName(
    officeId: string,
    floorId: string,
    floorName: string,
  ): Promise<void> {
    try {
      const params = {
        TableName: this.floorsTableName,
        Item: {
          id: floorId,
          name: floorName,
          officeId: officeId,
        },
      }

      await this.documentClient.put(params).promise()
    } catch (e) {
      console.error('Failed to update floor', e)
      throw new Error('Failed to update floor')
    }
  }
}
