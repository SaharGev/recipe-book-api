// src/app.ts
import express, { Express} from 'express';
import cors from "cors";
import authRoute from "./routes/authRoute";
import recipeRoutes from "./routes/recipeRoute";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authenticate } from './middlewares/authMiddleware';
dotenv.config({ path: '.env.dev' });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);

app.use("/recipes", authenticate,recipeRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});



const initApp = () => {
  const pr = new Promise<Express>((resolve, reject) => {
    const dbUrl = process.env.MONGO_URI;
    if (!dbUrl) {
      reject("MONGO_URI is not defined");
      return;
    }

    mongoose
      .connect(dbUrl, {})
      .then(() => {
        resolve(app);
      });

    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
  });

  return pr;
};

export default initApp;