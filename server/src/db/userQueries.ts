import * as db from "../db/pool.js"

export async function getUserTimezone(user_id: string) {
    const { rows } = await db.query("SELECT users.username,timezones.zone FROM users LEFT JOIN timezones on users.timezone_id = timezones.id WHERE users.id = $1", [user_id])
    return rows[0]
}
