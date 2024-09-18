import express from "express";
const router = express.Router();
import * as cardController from "../controllers/cardController.js";
import * as utils from "../auth/utils.js";
//* These routes should probably be protected(need to be logged in)
router.post("/known", utils.authenticateJwt, cardController.cardKnown);
router.post("/unknown", utils.authenticateJwt, cardController.cardUnknown);
export default router;
