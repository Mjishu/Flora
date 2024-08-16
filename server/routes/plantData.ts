import express from "express"
const router = express.Router()

import * as plantDataController from "../controllers/plantDataController";

router.get("/florida-trees", plantDataController.floridaTrees);

router.get("/srs", plantDataController.getSRS)

export default router

