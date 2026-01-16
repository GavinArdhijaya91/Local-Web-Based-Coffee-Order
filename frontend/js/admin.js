import express from "express";
import jwt from "jsonwebtoken";
import { orders } from "../data/orders.js";

const router = express.Router();

router.get("/orders", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "SECRET_KEY", err => {
    if (err) return res.sendStatus(403);
    res.json(orders);
  });
});

router.put("/orders/:id", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "SECRET_KEY", err => {
    if (err) return res.sendStatus(403);

    const { status } = req.body;
    const order = orders.find(o => o.id == req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    order.status = status;

    // record when an order finished so UIs can compute removal timing
    if ((status || "").toLowerCase() === "selesai") {
      order.finishedAt = new Date().toISOString();
    } else {
      delete order.finishedAt;
    }

    res.json({ message: "Status diperbarui" });
  });
});

export { orders };
export default router;