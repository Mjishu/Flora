import pkg from 'pg';
import dotenv from "dotenv"
dotenv.config();
const { Client } = pkg;

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


const answers = [
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


async function main() {
    console.log("seeding...")
    const client = new Client({
        connectionString: process.env.PSQL_URL
    });
    await client.connect();
    for (let i = 0; i < answers.length; i++) {

        await client.query("INSERT INTO quiz_details_answers(quiz_id,answer,is_correct) values ($1,$2,$3);", [answers[i].quiz_id, answers[i].answer, answers[i].is_correct]);
    }
    await client.end();
    console.log("done")
}

main();

