import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
import * as db from "../db/pool"
import bcrypt from "bcrypt";
import passport from "passport";
import "./auth/local-strategy"

dotenv.config();

export const getUser = asyncHandler(async (req, res) => {
    const result = await db.query('SELCECT * FROM users WHERE username = $1', [req.params.username])
    res.send("User is getting ready!")
})

export const createUser = asyncHandler(async (req, res) => {
    const user = await db.query("SELECT * FROM users WHERE username = $1", [req.body.username])
    if (user.rows[0]) {
        res.json({ message: "fail", user: user });
        console.log("user already exists");
        return
    }
    const body = req.body
    const hash = await bcrypt.hash(body.password, 10)
    const newUser = {
        username: body.username,
        password: hash,//!Change to BCRYPT
        email: body.email,
    }
    const userEntry = await db.query('INSERT INTO users (username,password,email) VALUES ($1,$2,$3) RETURNING *',
        [newUser.username, newUser.password, newUser.email]
    )
    if (userEntry.rows[0]) {
        res.json({ message: "success" })
    } else {
        res.json({ message: "fail" })
    }
})


export const loginUser = asyncHandler(async (req, res) => {
    console.log("recieved login details");
    //need to create user first and then make a call to db searching for user
    const userPassword = await db.query('SELECT password FROM users WHERE username = $1', [req.body.username])
    if (!userPassword) {
        res.json({ message: "fail" })
        console.log("incorrect username")
        return
    }
    const match = await bcrypt.compare(req.body.password, userPassword.rows[0].password)
    if (!match) {
        res.json({ message: "fail" })
        console.log("incorrect password")
        return
    }
    res.json({ message: `logging in user ${req.body.username}` })
})

export const userAuth = (passport.authenticate("local"), (request, response) => {

})