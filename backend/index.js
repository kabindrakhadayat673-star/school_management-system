import express from "express";
import dotenv from "dotenv";
import db from "./config/dbconnection.js";
import cookieparser from "cookie-parser";
import teacher_Router from "./routes/teacher.routes.js";
import testrouter from "./routes/testroutes.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cookieparser());
// TO PARSE JSON REQUEST BODIES
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API is running....");
});

const port = process.env.port;

app.use("/api/auth", testrouter);
app.use("/api/teacher", teacher_Router);
app.use(globalErrorHandler);

try {
  db.connect();
  console.log("my sql connect succesfull");
} catch (error) {
  console.error("mysql connection failed", error);
}

app.listen(port, () => {
  //arrow function ()=>
  console.log(`server is running  in port ${port}`);
});
