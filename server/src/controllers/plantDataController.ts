import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import { Response, Request } from "express"
import * as db from "../db/plantQueries.js";
import * as srs from "../srs.js";
import { plant_data } from "../../src/types/card_types.js";

export async function se_plants_na(req: Request, res: Response) {
    if (!req.user) { return res.json({ message: "You are not logged in" }) }
    try {
        const cards: plant_data[] = await srs.readyForReview(req.user.id, 10) //* 10 here is the limit for the amount of new cards shown
        res.json(cards)
    } catch (error) {
        console.error(`Error in se_plants_na: ${error}`);
        res.status(500).json({ message: "error occured", success: false })
    }
}
//*/

// export async function populateTimezones(req, res) {
//     insertTimezones()
// }