import db from "../config/dbconnection.js";
import { removeImg } from "../utils/removeimg.js";

export const addTeacher = async (req, res, next) => {
  try {
    const { name, email, phone, position } = req.body;

    if (!name || !email || !phone || !position) {
      if (req.file) {
        removeImg(req.file.path);
      }
      res.json({
        message: "ALL fields are required",
      });
    }
    // check first email
    const [exciting] = await db.execute(
      "SELECT ID FROM teacher WHERE email =?",
      [email]
    );
    if (exciting.length > 0) {
      if (req.file) {
        removeImg(req.file.path);
      }

      return res.status(409).json({
        message: "EMAIL ALREADY EXITS. USE ANOTHER EMAIL.",
      });
    }
    // phone number
    const [phmatch] = await db.execute(
      "SELECT ID FROM teacher WHERE phone =?",
      [phone]
    );
    if (phmatch.length > 0) {
      if (req.file) {
        removeImg(req.file.path);
      }
      return res.status(409).json({
        message: "phone ALREADY EXITS. USE ANOTHER phone.",
      });
    }

    const img = req.file ? `uploads/teacher/${req.file.filename}` : null;

    // insert teacher
    await db.execute(
      "INSERT INTO teacher(name,email,phone,position,img)VALUES(?,?,?,?,?)",
      [name, email, phone, position, img]
    );
    return res.status(201).json({
      message: "teacher added succesfull",
    });

    // console.log(name, email, phone, position);
  } catch (error) {
    next(error);
  }
};

export const getALLTeachers = async (req, res, next) => {
  try {
    const [getALLTeachers] = await db.execute("SELECT * FROM teacher");
    res.status(200).json({
      data: getALLTeachers,
    });
  } catch (error) {}
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await db.execute("SELECT id FROM teacher WHERE id =?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({
        message: "teacher not found",
        message: `Teacher not found with this ${id}`,
      });
    }
    await db.execute("DELETE from teacher where id=?", [id]);
    return res.status(200).json({
      message: `teacher deleted successfully with id ${id}`,
    });
  } catch (error) {
    next(error);
  }
};
export const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, position } = req.body;

    // Check if teacher exists
    const [existing] = await db.execute("SELECT * FROM teacher WHERE id = ?", [
      id,
    ]);

    if (existing.length === 0) {
      return res.status(404).json({
        message: `Teacher not found with id ${id}`,
      });
    }

    const teacher = existing[0];

    // Use existing values if not provided
    const updatedName = name || teacher.name;
    const updatedEmail = email || teacher.email;
    const updatedPhone = phone || teacher.phone;
    const updatedPosition = position || teacher.position;

    // Check if email already exists for another teacher
    if (email && email !== teacher.email) {
      const [emailCheck] = await db.execute(
        "SELECT id FROM teacher WHERE email = ? AND id != ?",
        [email, id]
      );

      if (emailCheck.length > 0) {
        return res.status(409).json({
          message: "Email already exists. Use another email.",
        });
      }
    }
    // get image path if uploaded
    const imagePath = req.file ? `uploads/teacher/${req.file.filename}` : null;

    // Update teacher
    await db.execute(
      "UPDATE teacher SET name = ?, email = ?, phone = ?, position = ? WHERE id = ?",
      [updatedName, updatedEmail, updatedPhone, updatedPosition, imagePath, id]
    );

    return res.status(200).json({
      message: "Teacher updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
