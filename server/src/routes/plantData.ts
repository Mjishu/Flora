import express from "express"
const router = express.Router()

import * as plantDataController from "../controllers/plantDataController.js";

import * as utils from "../../auth/utils.js"

router.get("/na/south-east", utils.authenticateJwt, plantDataController.se_plants_na)

// router.get("/timezones", plantDataController.populateTimezones)

export default router

