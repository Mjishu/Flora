import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
import * as db from "../db/pool.js";
import * as userDb from "../db/userQueries.js"
import bcrypt from "bcrypt";
import * as utils from "../../auth/utils.js";
import { Response, Request } from "express";

dotenv.config();

export async function getCurrentUser(req: Request, res: Response) {
    if (!req.user) { return res.send({ message: "User not logged in", success: false }) }
    const { rows } = await db.query("select users.username,users.email,users.id,timezones.zone from users join timezones on users.timezone_id = timezones.id where users.id = $1",
        [req.user.id]
    )
    return res.json({ user: rows[0], success: true })
}

export async function getUser(req: Request, res: Response) {
    const { rows } = await db.query("select users.username,users.email,timezones.zone from users join timezones on users.timezone_id = timezones.id where users.id = $1",
        [req.params.id]
    )
    return res.json(rows[0])
}

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

export async function updateUser(req: Request, res: Response) {
    if (!req.user) { return res.send({ message: "User not logged in", success: false }) }
    await userDb.updateUserTimezone(req.user.id, req.body.id)

    res.send({ message: `Timezone updated to ${req.body.zone}`, success: true })
}

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
    res.status(200).json({ success: true, user: req.user })
})

export async function resetCards(req: Request, res: Response) {
    if (!req.user) {
        res.json({ message: "User is not logged in", success: false })
        return
    }
    try {
        await db.query('DELETE FROM user_card_data WHERE user_id = $1', req.user.id)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ message: "Failed to reset cards", success: false })
    }
}

export async function getTimezones(req: Request, res: Response) {
    const timezones = await userDb.getTimezones();
    res.send(timezones)
}

