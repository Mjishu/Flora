import express from "express";
const router = express.Router();
import * as plantDataController from "../controllers/plantDataController.js";
router.get("/northAmerica/southEast", plantDataController.se_plants_na);
export default router;
