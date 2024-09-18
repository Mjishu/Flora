import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../db/queries.js";
import { Client } from "pg";
import { Response, Request } from "express"
import * as srs from "../srs.js";

export async function cardKnown(req: Request, res: Response) {
    if (!req.user) {
        res.json({ message: "User is not logged in", success: false })
        return
    }
    srs.srsFunc(req.user.id, req.body.card_id, req.body.seen)
    res.json({ message: "You knew this card" })
}

export async function cardUnknown(req: Request, res: Response) {
    if (!req.user) {
        res.json({ message: "User is not logged in", success: false })
        return
    }
    srs.srsFunc(req.user.id, req.body.card_id, req.body.seen)
    res.json({ message: "You did not know this card" })
}
