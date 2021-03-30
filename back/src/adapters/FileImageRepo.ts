import { ImageRepo } from "../usecase/ports/ImageRepo";
import * as fs from "fs";

export class FileImageRepo implements ImageRepo {
  constructor(private folderPath: string) {}

  getFloorPlan(floorId: string): Promise<string> {
    const res = fs.readFileSync(`${this.folderPath}/${floorId}`, {
      encoding: "base64"
    });
    return Promise.resolve(res);
  }

  async uploadFloorPlan(floorId: string, imagePath: string): Promise<void> {
    const newPath = `${this.folderPath}/${floorId}`;
    return this.moveFile(newPath, imagePath);
  }

  private moveFile(destination, origin): Promise<void> {
    return new Promise(function(resolve) {
      fs.rename(origin, destination, err => {
        if (err) {
          throw Error(err.message);
        } else {
          resolve();
        }
      });
    });
  }
}
