import express from "express"
const router = express.Router()

import * as plantDataController from "../controllers/plantDataController.js";

router.get("/na/south-east", plantDataController.se_plants_na)

export default router

