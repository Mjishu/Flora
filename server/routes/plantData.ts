import express from "express"
const router = express.Router()

import * as plantDataController from "../controllers/plantDataController";

router.get("/", plantDataController.floridaTrees);

export default router