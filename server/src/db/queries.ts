import * as pool from "./pool.js";

const NORTHAMERICA_ID: number = 1;
const NA_southEast: number = 1;

export async function getFLoridaPlants() {
    const { rows } = await pool.query("SELECT * FROM florida_plants", "");
    return rows;
}

export async function insertCommonName(name: string) {
    await pool.query("INSERT INTO florida_plants (common_name) VALUES ($1)", [name])
}

export async function getSETreesNA() {
    const { rows } = await pool.query('SELECT * FROM plants WHERE region_id = $1 AND subregion_id = $2;', [NORTHAMERICA_ID, NA_southEast]);
    return rows;
}

export async function getUserCardData(user_id: string, card_id: string) {
    const { rows } = await pool.query("SELECT * FROM user_card_data WHERE user_id = $1 AND card_id = $2 ", [user_id, card_id])
    return rows;
}

interface cardInterface { //todo Left off here, add types from user_card_data
    user_id: string,
    card_id: string,
    streak: number,
    interval: number,
    efactor: number,
}

export async function insertUserCardData(new_card: cardInterface) {
    const { rows } = await pool.query('INSERT INTO user_card_data (user_id,card_id,streak,interval,efactor) values ($1,$2,$3,$4,$5);', [
        new_card.user_id, new_card.card_id, new_card.streak, new_card.interval, new_card.efactor
    ])
    return
}

export async function updateCardRelationStreak(n: number, interval: number, user_id: string, card_id: string) {
    await pool.query('update user_card_data set streak = $1, interval = $2 where user_id = $3 and card_id = $4', [n, interval, user_id, card_id]);
    return
}

export async function last_seenToUnix(card_id: string, user_id: string) {//* isnt finding anything
    const { rows } = await pool.query("SELECT EXTRACT(EPOCH FROM last_seen) AS last_seen_unix,interval FROM user_card_data WHERE card_id = $1 AND user_id = $2",
        [card_id, user_id]);
    //const { rows } = await pool.query("SELECT date_created FROM user_card_data WHERE user_id = $1 AND card_id = $2;", [user_id, card_id]);
    return rows;
}