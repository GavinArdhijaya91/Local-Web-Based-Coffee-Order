import express from "express";
import jwt from "jsonwebtoken";
import { users } from "../data/users.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Login gagal" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });

  console.log("METHOD:", req.method);
  console.log("HEADERS:", req.headers["content-type"]);
  console.log("BODY:", req.body);
});



export default router;