import express from "express";
const router = express.Router();

import * as cardController from "../controllers/cardController.js";
import * as utils from "../../auth/utils.js";

//* These routes should probably be protected(need to be logged in)
router.post("/answer", utils.authenticateJwt, cardController.cardAnswer);

router.post("/is-ready", utils.authenticateJwt, cardController.isCardReady);


export default router;
