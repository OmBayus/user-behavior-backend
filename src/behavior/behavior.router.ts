import express from "express";

const router = express.Router();

import { getFromBehavior, create } from "./behavior.controller";

router.get("/getFromBehavior", getFromBehavior);
router.post("/create", create);

export default router;
