import express from "express";
import { islogin } from "../middlewares/islogin.js";
import {
  login,
  signout,
  testcontroller,
} from "../controller/test.controller.js";

const testrouter = express.Router();
testrouter.get("/users", islogin, testcontroller);
testrouter.post("/login", login);
testrouter.post("/signout", islogin, signout);

export default testrouter;
// testrouter.get("/callme",callme);
