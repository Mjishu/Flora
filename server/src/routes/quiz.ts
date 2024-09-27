import express from "express";
const router = express.Router();

import * as quizController from "../controllers/quizController.js";
import * as utils from "../../auth/utils.js";

//* These routes should probably be protected(need to be logged in)
router.post("/details/create", utils.authenticateJwt, quizController.create_quiz_details);

router.post("/details", utils.authenticateJwt, quizController.get_quiz_details)

router.get("/details/:id/update", utils.authenticateJwt, quizController.update_quiz_details)


export default router;
