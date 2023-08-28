import { Express } from "express";

import behavior from "./behavior/behavior.router";

export default (app: Express) => {
  app.use("/behavior", behavior);
};
