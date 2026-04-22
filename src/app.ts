// src/app.ts
import express, { Express } from "express";
import path from "path";
import cors from "cors";
import authRoute from "./routes/authRoute";
import recipeRoutes from "./routes/recipeRoute";
import recipeBookRoute from "./routes/recipeBookRoute";
import likeRoute from "./routes/likeRoute";
import mongoose from "mongoose";
import dotenv from "dotenv";
import commentRoute from "./routes/commentRoute";
import uploadRoute from "./routes/uploadRoute";
import userRoute from "./routes/userRoute";
import aiRoute from "./routes/aiRoute";
import swaggerUi from "swagger-ui-express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require("./swagger.json");

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env.dev",
});

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/public", express.static(path.join(process.cwd(), "public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRoute);
app.use("/likes", likeRoute);
app.use("/comments", commentRoute);
app.use("/upload", uploadRoute);
app.use("/users", userRoute);
app.use("/recipe-books", recipeBookRoute);

app.use("/recipes", recipeRoutes);
app.use("/ai", aiRoute);

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

    mongoose.connect(dbUrl, {}).then(() => {
      resolve(app);
    });

    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
  });

  return pr;
};

export default initApp;