import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../db/plantQueries.js";
import * as pool from "../db/pool.js"
import { Client } from "pg";
import { Response, Request } from "express"
import * as srs from "../srs.js";

export async function cardAnswer(req: Request, res: Response) {
    const { creature_id, seen } = req.body;
    if (!req.user) {
        res.status(400).json({ message: "User is not logged in", success: false })
        return
    }
    try {
        await srs.srsFunc(req.user.id, creature_id, seen) //todo change req.body.card_id to be req.body.creature_id(needs to be done on frontend)
        res.json({ message: `You answered this card ${creature_id}` })
    } catch (err) {
        console.error(`error in card Answer: ${err}`)
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

