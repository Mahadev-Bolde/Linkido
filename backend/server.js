import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(postsRoutes);
app.use(userRoutes);

const start = async () => {
  const connectDb = await mongoose.connect(
    "mongodb+srv://linkedinCloneabhi:linkedinCloneabhi@linkedinclone.r9dcqxt.mongodb.net/?appName=LinkedinClone",
  );
  console.log(`DB connected`);
  app.listen(9000, () => {
    console.log(`Server is running on port 9000`);
  });
};

start();
