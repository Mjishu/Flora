import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import { Response, Request } from "express"
import * as db from "../db/plantQueries.js";
import * as srs from "../srs.js";
import { plant_data } from "../../src/types/card_types.js";

function sortData(data: { [key: string]: unknown }[]): { [key: string]: unknown }[] {
    return data.map((entry: { [key: string]: unknown }) => ({
        common_name: entry.common_name,
        image_url: entry.image_url,
        scientific_name: entry.scientific_name,
        rank: entry.rank,
        family_common_name: entry.family_common_name,
        genus: entry.genus,
        family: entry.family,
    }))
};

export const floridaTrees = asyncHandler(async (req, res, next) => {
    //How to put this data in the database?
    //res.json({ message: "finding trees" }) //instead of sending this put it db and then send db entries to frontend
    const url = `https://trefle.io/api/v1/plants?token=${process.env.TREFLE_TOKEN}&filter[distribution]=florida&filter[plant_type]=tree`
    const response = await fetch(url)
    const json = await response.json()
    const mapped = sortData(json.data) //How to put this data in the database?
    res.send(mapped) //instead of sending this put it db and then send db entries to frontend
})

export async function se_plants_na(req: Request, res: Response) {
    if (!req.user) { return res.json({ message: "You are not logged in" }) }
    const cards: plant_data[] = await srs.readyForReview(req.user.id, 10) //* 10 here is the limit for the amount of new cards shown
    // const plants: plant_data[] = await db.getSETreesNA()
    res.send(cards)
}
//*/
export async function getFloridaTrees(req: Request, res: Response) { //* unused
    const florida_plants = await db.getFLoridaPlants();
    res.send("plants are: " + florida_plants.map((name: any) => name.common_name).join(", "))
}

// export async function populateTimezones(req, res) {
//     insertTimezones()
// }