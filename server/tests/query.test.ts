import { expect, test, vi } from 'vitest';
import * as db from "../src/db/plantQueries.js";
import timezoneMock from "timezone-mock";
import * as pool from "../src/db/pool.js"


timezoneMock.register("UTC")

await pool.query("BEGIN", ""); // * Starts transaction
const mockDate = new Date("2024-09-20T02:00:00Z");

const user_id = "53b9e8a1-778c-408e-b9e6-66103db3becf"
const card_id = "eac31de0-1507-41cf-9b10-a75b1a419a5e"

vi.setSystemTime(mockDate);

const { rows } = await pool.query(`SELECT date_trunc('day', u.last_seen + interval '1 second' * (u.interval * 86400)) + interval '2 hour' AS computed_time
 FROM user_card_data u
 WHERE u.user_id = $1`, [user_id]
)

await pool.query('UPDATE user_card_data SET interval = $1 WHERE user_id = $2 AND card_id = $3', [1, user_id, card_id])
const result = await db.cardsReady(user_id)

test("Card shows up after 2am", async () => {

    // const { rows } = await pool.query("SELECT * FROM user_card_data WHERE user_id = $1 AND card_id = $2", [user_id, card_id])
    // expect(rows[0].last_seen).toBe(new Date("2024-09-20 11:34:21.049084-04"));
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(card_id);
});

test("computed time is correct", () => {
    expect(rows[0].computed_time).toBe(new Date("2024-09-21T02:00:00Z"))
})

vi.useRealTimers();
await pool.query("ROLLBACK", ""); //* End transaction

timezoneMock.unregister();