import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = (req, res) => {
  //Check existing User
  const q = "SELECT * FROM  user WHERE email =? OR username =? ";
  db.query(q, [req.body.email, req.body.name], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User  already exixts!");

    //Hash the password   and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO user(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("User has been create.");
    });
  });
};
export const login = (req, res) => {
  //Chek User
  const q = "SELECT * FROM user WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("user Not found !");

    //Check password
    const IsPassordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!IsPassordCorrect)
      return res.status(400).json("wrong password or username");

    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(data[0]);
  });
};
export const logout = (req, res) => {};
