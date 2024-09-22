import * as pool from "./pool.js";
import * as userQueries from "./userQueries.js"

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

export async function updateCardRelationStreak(n: number, interval: number, user_id: string, card_id: string, seen: boolean, newEfactor: number) {
    await pool.query(`update user_card_data set streak = $1, interval = $2, efactor = $6,
        all_time_known = all_time_known + CASE WHEN $3 = true THEN 1 ELSE 0 END, all_time_unknown = all_time_unknown + CASE WHEN $3 = false THEN 1 ELSE 0 END
        where user_id = $4 and card_id = $5`, [n, interval, seen, user_id, card_id, newEfactor]);
    return
}

export async function last_seenToUnix(card_id: string, user_id: string) {//* isnt finding anything
    const { rows } = await pool.query("SELECT EXTRACT(EPOCH FROM last_seen) AS last_seen_unix,interval FROM user_card_data WHERE card_id = $1 AND user_id = $2",
        [card_id, user_id]);
    //const { rows } = await pool.query("SELECT date_created FROM user_card_data WHERE user_id = $1 AND card_id = $2;", [user_id, card_id]);
    return rows;
}

export async function cardsReady(user_id: string) {
    const user = await userQueries.getUserTimezone(user_id);
    const { rows } = await pool.query(
        `SELECT p.* FROM plants p JOIN user_card_data u ON p.id = u.card_id 
        WHERE u.user_id = $1  
            AND NOW() >= (u.last_seen + interval '1 second' * (u.interval * 86400))
            AND (
                date_trunc('day', u.date_created) = date_trunc('day', NOW())
                OR (
                    date_trunc('day', NOW() AT TIME ZONE $2) + interval '2 hour'
                    <= NOW() AT TIME ZONE $2
    )
  )`, [user_id, user.zone]) //! the interval '2 hour' on line 64 might be why its not going to 2 am and is going to 4am
    return rows
}

export async function unseenCards(user_id: string, limit: number) {
    const { rows } = await pool.query("SELECT p.* FROM plants p LEFT JOIN user_card_data u ON p.id = u.card_id AND u.user_id = $1 WHERE u.card_id IS NULL LIMIT $2;", [user_id, limit])
    return rows;
}


export async function insertTimezones() {
    console.log("timezones called")
    const timeZones = [
        { utc_offset: "UTC-12:00", zone: "Etc/GMT+12" },
        { utc_offset: "UTC-11:00", zone: "Pacific/Midway" },
        { utc_offset: "UTC-10:00", zone: "Pacific/Honolulu" },
        { utc_offset: "UTC-09:00", zone: "America/Anchorage" },
        { utc_offset: "UTC-08:00", zone: "America/Los_Angeles" },
        { utc_offset: "UTC-07:00", zone: "America/Denver" },
        { utc_offset: "UTC-06:00", zone: "America/Chicago" },
        { utc_offset: "UTC-05:00", zone: "America/New_York" },
        { utc_offset: "UTC-04:00", zone: "America/Santiago" },
        { utc_offset: "UTC-03:00", zone: "America/Argentina/Buenos_Aires" },
        { utc_offset: "UTC-02:00", zone: "Atlantic/South_Georgia" },
        { utc_offset: "UTC±00:00", zone: "Europe/London" },
        { utc_offset: "UTC+01:00", zone: "Europe/Berlin" },
        { utc_offset: "UTC+02:00", zone: "Europe/Istanbul" },
        { utc_offset: "UTC+03:00", zone: "Europe/Moscow" },
        { utc_offset: "UTC+04:00", zone: "Asia/Dubai" },
        { utc_offset: "UTC+05:00", zone: "Asia/Karachi" },
        { utc_offset: "UTC+05:30", zone: "Asia/Kolkata" },
        { utc_offset: "UTC+06:00", zone: "Asia/Dhaka" },
        { utc_offset: "UTC+07:00", zone: "Asia/Bangkok" },
        { utc_offset: "UTC+08:00", zone: "Asia/Singapore" },
        { utc_offset: "UTC+09:00", zone: "Asia/Tokyo" },
        { utc_offset: "UTC+10:00", zone: "Australia/Sydney" },
        { utc_offset: "UTC+11:00", zone: "Pacific/Majuro" },
        { utc_offset: "UTC+12:00", zone: "Pacific/Fiji" }
    ];
    for (let i = 0; i < timeZones.length; i++) {
        await pool.query("INSERT INTO timezones (utc_offset,zone) values($1,$2)", [timeZones[i].utc_offset, timeZones[i].zone])
    }
}