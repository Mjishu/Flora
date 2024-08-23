import * as pool from "./pool.js";

async function getAllCommonNames() {
    const { rows } = await pool.query("SELECT * FROM florida_plants", "");
    return rows;
}

async function insertCommonName(name: string) {
    await pool.query("INSERT INTO florida_plants (common_name) VALUES ($1)", [name])
}

export {
    getAllCommonNames,
    insertCommonName
}