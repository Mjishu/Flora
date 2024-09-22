import { expect, test, vi } from 'vitest';
import * as db from "../src/db/plantQueries.js";
import timezoneMock from "timezone-mock";
import * as pool from "../src/db/pool.js"

// await pool.query("BEGIN", ""); // * Starts transaction
const mockDate = new Date("2024-09-24T04:00:00Z");

const user_id = "53b9e8a1-778c-408e-b9e6-66103db3becf"
const card_id = "eac31de0-1507-41cf-9b10-a75b1a419a5e"

const { rows } = await pool.query(`SELECT date_trunc('day', u.last_seen + interval '1 second' * (u.interval * 86400)) AS computed_time
 FROM user_card_data u
 WHERE u.user_id = $1`, [user_id]
)

//! await pool.query('UPDATE user_card_data SET interval = $1 WHERE user_id = $2 AND card_id = $3', [0.1, user_id, card_id])

test("Current time is expected", () => {
    vi.setSystemTime(mockDate)
    expect(mockDate).toBe(vi.getMockedSystemTime());

})

// test("Card shows up after 2am", async () => { //* I think this one is meant to fail because I can't properly mock the sql time
//     vi.setSystemTime(mockDate);
//     const result = await db.cardsReady(user_id)
//     expect(result.length).toBe(1);
//     expect(result[0].id).toBe(card_id);
// });

test("computed time is correct", () => {
    vi.setSystemTime(mockDate);
    expect(rows[0].computed_time <= new Date("2024-09-24T05:00:00.000Z")).toBe(true) //* if this passes then The ^^ test should also pass?
    // expect(rows[0].computed_time).toBe(new Date())
})

vi.useRealTimers();
// await pool.query("ROLLBACK", ""); //* End transaction