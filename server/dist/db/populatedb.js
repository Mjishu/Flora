"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Client } = require("pg");
require("dotenv").config();
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("seeding...");
        const client = new Client({
            connectionString: process.env.PSQL_URL
        });
        yield client.connect();
        yield client.query(SQL);
        yield client.end();
        console.log("done");
    });
}
main();
/**export const floridaTrees = asyncHandler(async (req, res, next) => {
    const url = `https://trefle.io/api/v1/plants?token=${process.env.TREFLE_TOKEN}&filter[distribution]=florida&filter[plant_type]=tree`
    const response = await fetch(url)
    const json = await response.json()
    res.json(json)
})
 */ 
