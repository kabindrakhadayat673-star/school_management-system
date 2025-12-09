import db from "../config/dbconnection.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const testcontroller = (req, res) => {
  res.send("hello kabi");
};
// export const callme= async(req,res)=>{
//    try {
//     const [user]=await db.query("SELECT * FROM users");
//     res.status(200).json({
//         data:user,
//     })
//    } catch (error) {
//     console.log(error);
//    }
// }
// Login Api
export const login = async (req, res, next) => {
  console.log(req.body);
  try {
    //1.get email and password from user side.
    const { email, password } = req.body;
    // 2.simple Validation

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    // CHECK USER IS AVAILABLE IN DATABASE
    console.log("Searching for email:", email);
    const [result] = await db.execute("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    console.log("Database result:", result);
    const user = result[0];
    // 3.USER FOUND
    if (result.length === 0) {
      console.log("No user found with email:", email);
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
    console.log("User found:", user.email);

    //   Check the found user found
    const ismatch = await bcryptjs.compare(password, user.password);
    if (!ismatch) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // jsonwebtoken
    const token = await jwt.sign(
      {
        // 1 your detalis
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      // 2.secret key
      process.env.SECRET_KEY,
      {
        // 3.Expire time
        expiresIn: process.env.EXPIRE,
      }
    );
    // storing token to cookies
    res.cookie("token", token);

    // 4.SUCESS then return response
    res.status(200).json({
      message: "login Sucessful",
      user:  {
        id: user.id,
        email: user.email,
        role: user.role,
        //     name: user.name,

        //     token: token,
      },
    });
  } catch (error) {
    next(error);
  }
};
// get me
export const getme = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
// signout
export const signout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Sucessfully signed out" });
  } catch (error) {
    next();
  }
};
