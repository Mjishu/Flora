import express from "express";
const router = express.Router();
import * as userController from "../controllers/userController.js";
import * as utils from "../auth/utils.js";
//! Getting 401 unauthorized, even with correct bearer token
router.get("/protected", utils.authenticateJwt, userController.isProtected);
router.get("/get/:id", userController.getUser);
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/reset", utils.authenticateJwt, userController.resetCards);
export default router;
