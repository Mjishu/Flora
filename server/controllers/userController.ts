import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
import * as db from "../db/pool.js"
import bcrypt from "bcrypt";
import passport from "passport";
import * as jwtPassport from "../auth/passport.js";
import * as utils from "../auth/utils.js"

dotenv.config();

export const getUser = asyncHandler(async (req, res) => {
    const result = await db.query('SELCECT * FROM users WHERE username = $1', [req.params.username])
    res.send("User is getting ready!")
})

export const createUser = asyncHandler(async (req, res) => {
    const user = await db.query("SELECT * FROM users WHERE username = $1", [req.body.username])
    if (user.rows[0]) {
        res.json({ message: "fail", user: user.rows[0] });
        console.log("user already exists");
        return
    }
    const body = req.body
    const hash = await bcrypt.hash(body.password, 10)
    const newUser = {
        username: body.username,
        password: hash,
        email: body.email,
    }
    const userEntry = await db.query('INSERT INTO users (username,password,email) VALUES ($1,$2,$3) RETURNING *',
        [newUser.username, newUser.password, newUser.email]
    )
    if (userEntry.rows[0]) {
        const jwt = utils.issueJWT(userEntry.rows[0])
        res.json({ success: true, user: userEntry.rows[0], token: jwt.token, expiresIn: jwt.expires })
    } else {
        res.json({ success: false, message: "fail" })
    }
})

export const loginUser = asyncHandler(async (req, res, next) => {
    try {
        const user = await db.query("SELECT * FROM users WHERE username = $1", [req.body.username])
        if (!user.rows[0]) {
            console.log("user does not exist")
            res.status(401).json({ success: false, message: "Incorrect credentials" })
        }

        const match = await bcrypt.compare(req.body.password, user.rows[0].password);
        if (match) {
            const tokenObject = utils.issueJWT(user.rows[0]);
            res.status(200).json({ success: true, user: user.rows[0], token: tokenObject.token, expiresIn: tokenObject.expires })
        } else {
            console.log("password is incorrect")
            res.status(401).json({ success: false, message: "Incorrect credentials" });
        }
    } catch (err) {
        next(err)
    }
})


export const isProtected = asyncHandler(async (req, res, next) => {
    console.log("isProtected called")
    console.log("req body is ", req.body)
    res.status(200).json({ success: true, user: req.user })
})