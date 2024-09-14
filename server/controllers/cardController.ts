import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../db/queries.js";
import { Client } from "pg";
import { Response, Request } from "express"
import srsFunc from "../srs.js";

export async function cardKnown(req: Request, res: Response) {
    console.log(req.body)
    res.json({ message: "You knew this card" })
}

export async function cardUnknown(req: Request, res: Response) {
    console.log(req.body)
    res.json({ message: "You did not know this card" })
}