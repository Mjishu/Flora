import express from "express"
const router = express.Router()
import passport from "passport"

import * as userController from "../controllers/userController.js"

//! Getting 401 unauthorized, even with correct bearer token
router.get("/protected", passport.authenticate("jwt", { session: false }), userController.isProtected)

router.get("/get/:id", userController.getUser);

router.post("/register", userController.createUser)

router.post("/login", userController.loginUser)

export default router