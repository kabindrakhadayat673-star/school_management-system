import express from "express";
import {
  addTeacher,
  deleteTeacher,
  getALLTeachers,
  updateTeacher,
} from "../controller/teacher.controller.js";
import { islogin } from "../middlewares/islogin.js";
import { upload } from "../utils/multerHandler.js";

const teacher_Router = express.Router();
teacher_Router.post(
  "/add-teacher",
  islogin,
  upload.single("image"),
  addTeacher
);
teacher_Router.get("/get-teacher", islogin, getALLTeachers);
teacher_Router.delete("/delete-teacher/:id", islogin, deleteTeacher);
teacher_Router.patch(
  "/update/:id",
  islogin,
  upload.single("image"),
  updateTeacher
);

export default teacher_Router;
