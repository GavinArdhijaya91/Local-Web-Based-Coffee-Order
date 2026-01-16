import express from "express";
import { auth } from "../middleware/auth.js";
import { customerOnly } from "../middleware/role.js";

const router = express.Router();

router.get("/dashboard", auth, customerOnly, (req, res) => {
  res.json({
    message: "Selamat datang CUSTOMER",
    data: "Pesanan kamu ada di sini"
  });
});

export default router;