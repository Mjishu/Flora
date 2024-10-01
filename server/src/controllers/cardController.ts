import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../db/plantQueries.js";
import * as pool from "../db/pool.js"
import { Client } from "pg";
import { Response, Request } from "express"
import * as srs from "../srs.js";

export async function cardKnown(req: Request, res: Response) {
    if (!req.user) {
        res.json({ message: "User is not logged in", success: false })
        return
    }
    try {

        await srs.srsFunc(req.user.id, req.body.card_id, req.body.seen)
        res.json({ message: "You knew this card" })
    } catch (err) {
        console.error(`error in cardknown: ${err}`)
        res.status(500).json({ message: "Error occured", success: false })
    }
}

export async function cardUnknown(req: Request, res: Response) {
    if (!req.user) {
        res.json({ message: "User is not logged in", success: false })
        return
    }
    try {
        await srs.srsFunc(req.user.id, req.body.card_id, req.body.seen)
        res.json({ message: "You did not know this card" })
    } catch (err) {
        console.error(`error in cardunknown: ${err}`)
        res.status(500).json({ message: "Error occured", success: false })
    }
}

export async function isCardReady(req: Request, res: Response) {
    console.log("is card ready was called!")
    if (!req.user) {
        res.json({ message: "User is not logged in", success: false })
        return
    }
    // srs.readyForReview(req.user.id, req.body.card_id)
}

