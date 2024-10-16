import express from "express"
const router = express.Router()
import passport from "passport"

import * as userController from "../controllers/userController.js"
import * as utils from "../../auth/utils.js"

//! Getting 401 unauthorized, even with correct bearer token
router.get("/current", utils.authenticateJwt, userController.getCurrentUser);

router.get("/get/:id", userController.getUser);

router.post("/update/:id", utils.authenticateJwt, userController.updateUser)

router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

router.get("/reset", utils.authenticateJwt, userController.resetCards)

router.get("/timezones", userController.getTimezones)

export default router
