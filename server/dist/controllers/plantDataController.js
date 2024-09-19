import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../src/db/queries.js";
///*
function sortData(data) {
    return data.map((entry) => ({
        common_name: entry.common_name,
        image_url: entry.image_url,
        scientific_name: entry.scientific_name,
        rank: entry.rank,
        family_common_name: entry.family_common_name,
        genus: entry.genus,
        family: entry.family,
    }));
}
;
export const floridaTrees = asyncHandler(async (req, res, next) => {
    //How to put this data in the database?
    //res.json({ message: "finding trees" }) //instead of sending this put it db and then send db entries to frontend
    const url = `https://trefle.io/api/v1/plants?token=${process.env.TREFLE_TOKEN}&filter[distribution]=florida&filter[plant_type]=tree`;
    const response = await fetch(url);
    const json = await response.json();
    const mapped = sortData(json.data); //How to put this data in the database?
    res.send(mapped); //instead of sending this put it db and then send db entries to frontend
});
export async function se_plants_na(req, res) {
    const plants = await db.getSETreesNA();
    console.log(plants);
    res.send(plants);
}
//*/
export async function getFloridaTrees(req, res) {
    const florida_plants = await db.getFLoridaPlants();
    console.log("plants are ", florida_plants);
    res.send("plants are: " + florida_plants.map((name) => name.common_name).join(", "));
}
