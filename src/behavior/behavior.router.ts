import express from "express";

const router = express.Router();

import { getBehaviorByFormId, create } from "./behavior.controller";

router.get("/getBehaviorByFormId/:formId", getBehaviorByFormId);
router.post("/create", create);

export default router;
