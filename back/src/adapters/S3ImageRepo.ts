import { ImageRepo } from '../usecase/ports/ImageRepo'
import AWS from 'aws-sdk'
import fs from 'fs'
export class S3ImageRepo implements ImageRepo {
  constructor(private s3Suffix: string) {}

  async uploadFloorPlan(floorId: string, image: any): Promise<void> {
    try {
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      })
      let fileStream = fs.createReadStream(image.path)
      fileStream.on('error', function (err) {
        console.error('File Error', err)
      })
      let params = {
        Bucket: `backend-bucket${this.s3Suffix}.talan.com`,
        Key: `floorPlans/${floorId}.png`,
        Body: fileStream,
      }
      s3.upload(params, function (s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
      })
    } catch (err) {
      console.error(`Error trying upload file in s3 : ${err}`)
      throw err
    }
  }

  async getFloorPlan(floorId: string): Promise<any> {
    try {
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      })

      const requestS3 = s3
        .getObject({
          Bucket: `backend-bucket${this.s3Suffix}.talan.com`,
          Key: `floorPlans/${floorId}.png`,
        })
        .promise()
      const { Body } = await requestS3
      return encode(Body)
    } catch (err) {
      console.error(
        `Error trying to fetch file from s3 bucket for filePath=/floorPlans/${floorId}.png : ${err}`,
      )
      throw err
    }
  }
}

function encode(data) {
  let buf = Buffer.from(data)
  let base64 = buf.toString('base64')
  return base64
}
