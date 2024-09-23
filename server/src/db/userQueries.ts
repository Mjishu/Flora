import * as db from "../db/pool.js"

export async function getUserTimezone(user_id: string) {
    const { rows } = await db.query("SELECT users.username,timezones.zone FROM users LEFT JOIN timezones on users.timezone_id = timezones.id WHERE users.id = $1", [user_id])
    return rows[0]
}

export async function getTimezones() {
    const { rows } = await db.query("SELECT zone,utc_offset,id FROM timezones;", "");
    return rows
}

export async function updateUserTimezone(user_id: string, timezone_id: number) {
    await db.query("UPDATE users SET timezone_id = $1 WHERE id = $2", [timezone_id, user_id])
}