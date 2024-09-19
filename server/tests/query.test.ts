import { expect, test } from 'vitest'
import * as db from "../src/db/queries.js"

test('last_seen to unix', async () => { //! test will probably fail because cards get last_seen time constantly updated
    const expectedDate = new Date("2024-09-18 17:47:59.673313-04").getTime() / 1000;
    const result = await db.last_seenToUnix("eac31de0-1507-41cf-9b10-a75b1a419a5e", "53b9e8a1-778c-408e-b9e6-66103db3becf")
    const lastSeenUnix = Math.floor(parseFloat(result[0].last_seen_unix))
    expect(lastSeenUnix).toBe(Math.floor(expectedDate))
})