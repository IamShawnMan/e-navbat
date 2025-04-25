import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDb } from "./db/index.js";
import { adminRouter } from "./routes/admin.routes.js";

config();

const PORT = +process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

await connectDb();

app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
