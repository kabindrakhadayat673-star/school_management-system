import sharp from "sharp";
import { removeimg } from "./removeimg.js";

export const compressimg = async (inputpath, outputpath) => {
  try {
    await sharp(inputpath)
      .resize({ width: 1000 })
      .jpeg({ quality: 100})
      .toFile(outputpath);

    await removeimg(inputpath);
    return outputpath;
  } catch (error) {
    console.error("sharp error", error);
  }
};
