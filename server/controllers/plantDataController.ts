import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../db/queries";
import { Client } from "pg";
import { Response, Request } from "express"

function sortData(data: { [key: string]: any }[]): { [key: string]: any }[] {
    return data.map((entry: { [key: string]: any }) => ({
        common_name: entry.common_name,
        image_url: entry.image_url,
        scientific_name: entry.scientific_name,
        rank: entry.rank,
        family_common_name: entry.family_common_name,
        genus: entry.genus,
        family: entry.family
    }))
};

export const floridaTrees = asyncHandler(async (req, res, next) => {
    const url = `https://trefle.io/api/v1/plants?token=${process.env.TREFLE_TOKEN}&filter[distribution]=florida&filter[plant_type]=tree`
    const response = await fetch(url)
    const json = await response.json()
    const mapped = sortData(json.data) //How to put this data in the database?
    res.send(mapped) //instead of sending this put it db and then send db entries to frontend
})

export async function getFloridaTrees(req: any, res: any) {
    const common_names = await db.getAllCommonNames();
    console.log("common_names are ", common_names);
    res.send("common names: " + common_names.map((name: any) => name.common_name).join(", "))
}