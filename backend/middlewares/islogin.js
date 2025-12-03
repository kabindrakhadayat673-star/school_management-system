// GET ME
import jwt from "jsonwebtoken";
export const islogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        message: "hey hacker you have to  logged in first",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
  }
};
