import express, { Express } from "express";
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
import swaggerUi from "swagger-ui-express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require("./swagger.json");

dotenv.config({ path: ".env.dev" });
dotenv.config({ path: '.env.dev' });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRoute);
app.use("/likes", likeRoute);
app.use("/comments", commentRoute);
app.use("/upload", uploadRoute);
app.use("/users", userRoute);
app.use("/recipe-books", recipeBookRoute);

app.use("/recipes", recipeRoutes);

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