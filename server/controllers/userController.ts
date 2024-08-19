import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from "express";
import * as db from "../db/pool"
import bcrypt from "bcrypt";

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
    //? Do I do a db.query  where i insert the information into the db as paramters?
    console.log(req.body)
    res.json(newUser)
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
    const match = await bcrypt.compare(req.body.password, userPassword)
    if (!match) {
        res.json({ message: "fail" })
        console.log("incorrect password")
        return
    }
    res.json({ message: `logging in user ${req.body.username}` })
})