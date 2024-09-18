import express from "express"
const router = express.Router()

import * as plantDataController from "../controllers/plantDataController.js";

router.get("/florida-trees", plantDataController.floridaTrees);

router.get("/northAmerica/southEast", plantDataController.se_plants_na)

router.get("/meower", plantDataController.Meower)

export default router

