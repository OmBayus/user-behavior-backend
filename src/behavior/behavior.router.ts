import express from "express";

const router = express.Router();

import { findAll, findOne, create } from "./behavior.controller";

router.get("/findAll", findAll);
router.get("/findOne/:id", findOne);
router.post("/create", create);

export default router;
