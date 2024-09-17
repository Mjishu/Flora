import * as pool from "./pool.js";
const NORTHAMERICA_ID = 1;
const NA_southEast = 1;
export async function getAllCommonNames() {
    const { rows } = await pool.query("SELECT * FROM florida_plants", "");
    return rows;
}
export async function insertCommonName(name) {
    await pool.query("INSERT INTO florida_plants (common_name) VALUES ($1)", [name]);
}
export async function getSETreesNA() {
    const { rows } = await pool.query('SELECT * FROM plants WHERE region_id = $1 AND subregion_id = $2;', [NORTHAMERICA_ID, NA_southEast]);
    return rows;
}
