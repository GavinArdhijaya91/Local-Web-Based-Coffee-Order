import express from "express";
import { orders } from "../data/orders.js";
import crypto from "crypto";

const router = express.Router();

router.post("/", (req, res) => {
  const { name, menu, qty, tableNumber, createdAt, paymentMethod, paid} = req.body;

  const orderCode = crypto.randomBytes(4).toString("hex");

  const newOrder = {
    id: Date.now(),
    orderCode,
    name,
    menu,
    qty,
    tableNumber: tableNumber ?? null,
    paymentMethod,
    paid,
    createdAt: createdAt ?? new Date().toISOString(),
    status: "pending"
  };

  orders.push(newOrder);
  res.json({ message: "Pesanan dibuat", orderCode });
});

router.get("/:orderCode", (req, res) => {
  const order = orders.find(
    o => o.orderCode === req.params.orderCode
  );

  if (!order) {
    return res.status(404).json({
      message: "Pesanan tidak ditemukan"
    });
  }
  res.json(order);
});

router.get("/", (req, res) => {
  console.log("ISI DATABASE ORDERS:", orders);
  res.json(orders);
});

router.delete("/:orderCode", (req, res) => {
  const index = orders.findIndex(
    o => o.orderCode === req.params.orderCode
  );

  if (index === -1) {
    return res.status(404).json({ message: "Pesanan tidak ditemukan" });
  }

  if (orders[index].status !== "pending") {
    return res.status(403).json({
      message: "Pesanan sudah diproses"
    });
  }

  orders.splice(index, 1);
  res.json({ message: "Pesanan dihapus" });
});

export default router;