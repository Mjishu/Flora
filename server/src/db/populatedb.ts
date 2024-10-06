import pkg from 'pg';
import dotenv from "dotenv"
dotenv.config();
const { Client } = pkg;
import * as pool from "./pool.js"

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

//* quiz answers here

const MagnoliaAnswers = [
    {
        quiz_id: "ee404454-b115-4c5e-b907-1899f6207f41",
        answer: "Rose Scented Leaves",
        is_correct: false,
    },
    {
        quiz_id: "ee404454-b115-4c5e-b907-1899f6207f41",
        answer: "Lemon Scented Flowers",
        is_correct: true
    },
    {
        quiz_id: "ee404454-b115-4c5e-b907-1899f6207f41",
        answer: "Large Dark Green Leaves",
        is_correct: true
    },
    {
        quiz_id: "ee404454-b115-4c5e-b907-1899f6207f41",
        answer: "Large White Flowers",
        is_correct: true
    },
    {
        quiz_id: "ee404454-b115-4c5e-b907-1899f6207f41",
        answer: "Spikey Leaves",
        is_correct: false
    },
    {
        quiz_id: "ee404454-b115-4c5e-b907-1899f6207f41",
        answer: "Max height of 10 meters",
        is_correct: false
    }

]
//* Make quizzes here

async function create_quizzes() {
    const { rows } = await pool.query("SELECT id FROM plants WHERE common_name != 'Southern Magnolia';", [])
    for (let i = 0; i < rows.length; i++) {
        await pool.query("INSERT INTO quiz_details(card_id) VALUES($1)", [rows[i].id])
    }
}

/*Ids
    Slash Pine:  de31587c-4f5e-40c1-9ede-2d00ec3d8d45
    Sago Palm: 22e04a49-4435-4e20-aec5-a4ba3925c941
    Tussock Paspalum:  a15f2ad5-987c-437e-bd0c-edf46d497a6e
*/

const answers = [
    //*    Slash pine
    { quiz_id: "de31587c-4f5e-40c1-9ede-2d00ec3d8d45", answer: "Slow Growing Tree", is_correct: false },
    { quiz_id: "de31587c-4f5e-40c1-9ede-2d00ec3d8d45", answer: "Up to 30 meters Tall", is_correct: true },
    { quiz_id: "de31587c-4f5e-40c1-9ede-2d00ec3d8d45", answer: "Needle-like Leaves", is_correct: true },
    { quiz_id: "de31587c-4f5e-40c1-9ede-2d00ec3d8d45", answer: "Trunk Diameter Reaches 5 meters ", is_correct: false },
    //*    Sago palm
    { quiz_id: "22e04a49-4435-4e20-aec5-a4ba3925c941", answer: "Very Symmetrical", is_correct: true },
    { quiz_id: "22e04a49-4435-4e20-aec5-a4ba3925c941", answer: "Thick Shaggy Trunky", is_correct: true },
    { quiz_id: "22e04a49-4435-4e20-aec5-a4ba3925c941", answer: "Fast growing", is_correct: false },
    { quiz_id: "22e04a49-4435-4e20-aec5-a4ba3925c941", answer: "Grows to 15 Meters", is_correct: false },
    //*    Tussock Paspalum
    { quiz_id: "a15f2ad5-987c-437e-bd0c-edf46d497a6e", answer: "Invasive ", is_correct: true },
    { quiz_id: "a15f2ad5-987c-437e-bd0c-edf46d497a6e", answer: "Grows to 6 Meters", is_correct: false },
    { quiz_id: "a15f2ad5-987c-437e-bd0c-edf46d497a6e", answer: "Bluish-Green Tuft", is_correct: true },
    { quiz_id: "a15f2ad5-987c-437e-bd0c-edf46d497a6e", answer: "30cm long leaves", is_correct: false },

]

async function insert_answers() {
    for (let i = 0; i < answers.length; i++) { //* check if quiz_id + value is already in there or not 
        const { quiz_id, answer, is_correct } = answers[i]

        const result = await pool.query("SELECT 1 FROM quiz_details_answers WHERE quiz_id = $1 AND answer = $2", [quiz_id, answer])
        if (result.rowCount === 0) {
            await pool.query("INSERT INTO quiz_details_answers(quiz_id,answer,is_correct) VALUES ($1,$2,$3)", [quiz_id, answer, is_correct])
        } else {
            console.log(`Record with quiz_id: ${quiz_id} and answer: ${answer} already exists`)
            continue
        }
    }
}

const utc_timezones = [
    { "zone": "Etc/GMT+12", "utc_offset": "UTC-12:00" },
    { "zone": "Etc/GMT+11", "utc_offset": "UTC-11:00" },
    { "zone": "Pacific/Apia", "utc_offset": "UTC-10:00" },
    { "zone": "Pacific/Honolulu", "utc_offset": "UTC-09:00" },
    { "zone": "America/Anchorage", "utc_offset": "UTC-08:00" },
    { "zone": "America/Los_Angeles", "utc_offset": "UTC-07:00" },
    { "zone": "America/Denver", "utc_offset": "UTC-06:00" },
    { "zone": "America/Chicago", "utc_offset": "UTC-05:00" },
    { "zone": "America/New_York", "utc_offset": "UTC-04:00" },
    { "zone": "America/Halifax", "utc_offset": "UTC-03:00" },
    { "zone": "America/St_Johns", "utc_offset": "UTC-02:30" },
    { "zone": "America/Godthab", "utc_offset": "UTC-02:00" },
    { "zone": "Etc/GMT-1", "utc_offset": "UTC-01:00" },
    { "zone": "Etc/GMT", "utc_offset": "UTC±00:00" },
    { "zone": "Europe/Berlin", "utc_offset": "UTC+01:00" },
    { "zone": "Europe/Bucharest", "utc_offset": "UTC+02:00" },
    { "zone": "Europe/Moscow", "utc_offset": "UTC+03:00" },
    { "zone": "Asia/Baku", "utc_offset": "UTC+04:00" },
    { "zone": "Asia/Karachi", "utc_offset": "UTC+05:00" },
    { "zone": "Asia/Dhaka", "utc_offset": "UTC+06:00" },
    { "zone": "Asia/Bangkok", "utc_offset": "UTC+07:00" },
    { "zone": "Asia/Singapore", "utc_offset": "UTC+08:00" },
    { "zone": "Asia/Tokyo", "utc_offset": "UTC+09:00" },
    { "zone": "Australia/Sydney", "utc_offset": "UTC+10:00" },
    { "zone": "Pacific/Guadalcanal", "utc_offset": "UTC+11:00" },
    { "zone": "Pacific/Fiji", "utc_offset": "UTC+12:00" },
    { "zone": "Pacific/Chatham", "utc_offset": "UTC+12:45" },
    { "zone": "Pacific/Tongatapu", "utc_offset": "UTC+13:00" },
    { "zone": "Pacific/Apia", "utc_offset": "UTC+14:00" }
]

export async function insert_timezones() {
    for (let i = 0; i < utc_timezones.length; i++) {
        const { zone, utc_offset } = utc_timezones[i]

        const result = await pool.query("SELECT 1 FROM timezones WHERE zone = $1 AND utc_offset = $2", [zone, utc_offset]);
        if (result.rowCount === 0) {
            await pool.query("INSERT INTO timezones(zone,utc_offset) VALUES ($1,$2)", [zone, utc_offset])
        } else {
            console.log(`Timezone with name: ${zone} And offset: ${utc_offset} is already in timezones table`)
            continue
        }
    }
}



