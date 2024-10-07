import express from "express";
const router = express.Router();

import * as quizController from "../controllers/quizController.js";
import * as utils from "../../auth/utils.js";
import * as pop from "../db/populatedb.js"

//* These routes should probably be protected(need to be logged in)
router.post("/details/create", utils.authenticateJwt, quizController.create_quiz_details);

router.post("/details", utils.authenticateJwt, quizController.get_quiz_details)

router.get("/details/:id", utils.authenticateJwt, quizController.insert_quiz_details)


export default router;
