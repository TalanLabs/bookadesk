import fs from "fs";

export const checkDirectoryExists = (path: string): Promise<void> => {
  return new Promise(function(resolve) {
    fs.access(path, function(err) {
      if (err && err.code === "ENOENT") {
        fs.mkdirSync(path, { recursive: true });
      }
      resolve();
    });
  });
};
