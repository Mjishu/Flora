import express from "express"
const router = express.Router()

import * as plantDataController from "../controllers/plantDataController";

router.get("/florida-trees", plantDataController.floridaTrees);

router.post("/srs", plantDataController.getSRS)

router.get("/meower", plantDataController.Meower)

export default router

