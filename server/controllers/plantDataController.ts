import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../db/queries.js";
import { Client } from "pg";
import { Response, Request } from "express"
import * as srs from "../srs.js";

///*
function sortData(data: { [key: string]: any }[]): { [key: string]: any }[] {
    return data.map((entry: { [key: string]: any }) => ({
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
    const plants = await db.getSETreesNA()
    res.send(plants)
}
//*/
export async function getFloridaTrees(req: Request, res: Response) {
    const common_names = await db.getAllCommonNames();
    console.log("common_names are ", common_names);
    res.send("common names: " + common_names.map((name: any) => name.common_name).join(", "))
}

export const Meower = asyncHandler(async (req, res) => {
    res.json("Im such a meower")
})

