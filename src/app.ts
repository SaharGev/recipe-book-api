import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

export default app;