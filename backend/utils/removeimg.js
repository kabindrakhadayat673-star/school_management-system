import fs from "fs";

export const removeimg = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (error) {
    console.error("Error removing image:", error);
  }
};
