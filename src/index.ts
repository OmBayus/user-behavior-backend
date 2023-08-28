import express from "express";
import compression from "compression";
import cors from "cors";
import { PORT } from "./utils/config";

const app = express();

app.use(compression());
app.use(cors());

app.use(express.json());

import "./utils/mongo";
import router from "./router";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

router(app);

app.listen(PORT, () => {
  console.log("listening on port:" + PORT + "!");
});
