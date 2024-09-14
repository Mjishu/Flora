import express from "express";
const router = express.Router();
import * as cardController from "../controllers/cardController.js";
//* These routes should probably be protected(need to be logged in)
router.post("/know", cardController.cardKnown);
router.post("/unknown", cardController.cardUnknown);
export default router;
