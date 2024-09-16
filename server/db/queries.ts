import * as pool from "./pool.js";

export async function getAllCommonNames() {
    const { rows } = await pool.query("SELECT * FROM florida_plants", "");
    return rows;
}

export async function insertCommonName(name: string) {
    await pool.query("INSERT INTO florida_plants (common_name) VALUES ($1)", [name])
}

export async function getSETreesNA() {
    const { rows } = await pool.query("SELECT * FROM se_plants_na;", "");
    return rows
}
