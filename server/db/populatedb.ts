const { Client } = require("pg")
require("dotenv").config()

/*// ? DB SHOULD HAVE
    N value, time_till_next_review, eFactor,
*/

const SQL = `
CREATE TABLE IF NOT EXISTS florida_plants (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    common_name TEXT,
    image_url TEXT
);

INSERT INTO florida_plants (common_name, image_url)
VALUES
('wheat','wheat.png'),
('meower','meower.png'),
('milkweed','milkweed.png');
`;

function sortData(data: { [key: string]: any }[]): { [key: string]: any }[] {
    return data.map((entry: { [key: string]: any }) => ({
        common_name: entry.common_name,
        image_url: entry.image_url,
        scientific_name: entry.scientific_name,
        rank: entry.rank,
        family_common_name: entry.family_common_name,
        genus: entry.genus,
        family: entry.family,
    }))
};

async function callTrefle() {
    const url = `https://trefle.io/api/v1/plants?token=${process.env.TREFLE_TOKEN}&filter[distribution]=florida&filter[plant_type]=tree`
    const response = await fetch(url)
    const json = await response.json()
    const mapped = sortData(json.data)
}

async function main() {
    console.log("seeding...")
    const client = new Client({
        connectionString: process.env.PSQL_URL
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done")
}

main();

/**export const floridaTrees = asyncHandler(async (req, res, next) => {
    const url = `https://trefle.io/api/v1/plants?token=${process.env.TREFLE_TOKEN}&filter[distribution]=florida&filter[plant_type]=tree`
    const response = await fetch(url)
    const json = await response.json()
    res.json(json)
})
 */