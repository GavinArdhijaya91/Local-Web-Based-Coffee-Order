import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import customerRoutes from "./routes/customer.js";
import ordersRoutes from "./routes/orders.js";

const app = express();



app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/orders", ordersRoutes);

app.get("/", (req, res) => {
  res.send("Backend berjalan dengan normal 🚀");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
});

