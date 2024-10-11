import express from "express";
const router = express.Router();

import * as quizController from "../controllers/courseController.js";
import * as utils from "../../auth/utils.js";
import * as pop from "../db/populatedb.js"

router.get("/all", quizController.get_all_courses)

router.get("/lessons/:id", quizController.get_lesson_data)

router.get("/:id", quizController.get_courses) //Everything should be above this 



export default router;
