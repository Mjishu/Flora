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

const courses = `CREATE TABLE courses(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title varchar(90) NOT NULL, image_src text);`

const units = `CREATE TABLE units(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title varchar(90) NOT NULL,description TEXT NOT NULL, course_id uuid REFERENCES courses(id) NOT NULL,unit_order INT NOT NULL )`

const lessons = `CREATE TABLE lessons(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),title varchar(90) NOT NULL,unit_id UUID REFERENCES units(id) NOT NULL,lesson_order INT NOT NULL)`

const createEnumType = `
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_type') THEN 
            CREATE TYPE CHALLENGE_TYPE AS ENUM ('multiple_choice','fill_in_the_blank', 'true_false');
        END IF;
    END $$;
`;

const challenges = `CREATE TABLE challenges(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),lesson_id uuid REFERENCES lessons(id) NOT NULL,type CHALLENGE_TYPE NOT NULL,challenge_order INT NOT NULL)`

const challenge_options = `CREATE TABLE challenge_options(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),challenge_id uuid REFERENCES challenges(id) NOT NULL,correct BOOLEAN NOT NULL,
    text TEXT NOT NULL, image_src TEXT,audio_src TEXT)`

const challenge_progress = `CREATE TABLE challenge_progress(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),challenge_id uuid REFERENCES challenges(id) NOT NULL,correct BOOLEAN NOT NULL,
    text TEXT NOT NULL,image_src TEXT,audio_src TEXT )`


/*All relations
    courses < units
    units < lessons
    lessons < challenges
    challenges < challenge_options
    challenges < challenge_progress
*/

export async function create_courses() { //! before calling this make the relation tables aswell
    try {
        await pool.query(courses, [])
        await pool.query(units, [])
        await pool.query(lessons, [])
        await pool.query(createEnumType, [])
        await pool.query(challenges, [])
        await pool.query(challenge_options, [])
        await pool.query(challenge_progress, [])
    } catch (error) {
        console.error(`Error Creating tables: ${error}`)
    }
}


//* enetering into courses

//Units

export async function input_courses() {
    const courses_inputs = [
        //Courses
        { table: "courses", title: "Flora" },
        { table: "courses", title: "Fauna" },
        { table: "courses", title: "Fungi" },
    ]
    for (let i = 0; i < courses_inputs.length; i++) {
        const { table, title } = courses_inputs[i]

        const result = await pool.query("SELECT 1 FROM courses WHERE title = $1 ", [title])
        if (result.rowCount === 0) {
            await pool.query("INSERT INTO courses(title) VALUES ($1)", [title])
        } else {
            console.log(`Record with title: ${title} already exists`)
            continue
        }
    }
}

export async function input_units() {
    const { rows } = await pool.query("SELECT id FROM courses WHERE title='Flora'", [])
    const id = rows[0].id
    const units_inputs = [
        { table: "units", title: "Intro to Plants", description: "Starting from the beginning, this will make sure you have the fundamentals down", course_id: id, unit_order: 1 },
        { table: "units", title: "Taxonomical Rankings", description: "Sure you know what a species is but what about a kingdom? a phylum? a order?", course_id: id, unit_order: 2 },
        { table: "units", title: "Classes of Plants", description: "What are the different types of plants? what is an angiosperm and what's a gymnosperm?", course_id: id, unit_order: 3 },
        { table: "units", title: "Regions", description: "Where do different plants grow, do plants have similar traits in different locations?", course_id: id, unit_order: 4 },
        { table: "units", title: "Identifying Plants", description: "Get a basic understanding of how to identify different plants", course_id: id, unit_order: 5 },
        { table: "units", title: "Invasive Species", description: "Why are invasive species so devastating and why is conservation important?", course_id: id, unit_order: 6 },
    ]
    for (let i = 0; i < units_inputs.length; i++) {
        const { table, title, description, course_id, unit_order } = units_inputs[i]

        const result = await pool.query("SELECT 1 FROM units WHERE title = $1 AND description = $2", [title, description])
        if (result.rowCount === 0) {
            await pool.query("INSERT INTO units(title,description,course_id,unit_order) VALUES ($1,$2,$3,$4)", [title, description, course_id, unit_order])
        } else {
            console.log(`Record with title: ${title} already exists`)
            continue
        }
    }
}

export async function input_lessons() {
    const lessons_inputs = [
        //*unit_id = await pool.query("select unit_id from courses where title="Intro to Plants")
        { table: "lessons", title: "What is a Plant", unit_id: "", lesson_order: 1 },
        { table: "lessons", title: "Plants and the Environment", unit_id: "", lesson_order: 2 },
        { table: "lessons", title: "Physiology", unit_id: "", lesson_order: 3 },
        //*unit_id = await pool.query("select unit_id from courses where title="Taxonomical Rankings")
        { table: "lessons", title: "Taxonomical Order", unit_id: "", lesson_order: 1 },
        { table: "lessons", title: "General Rankings", unit_id: "", lesson_order: 2 },
        { table: "lessons", title: "Specific Ranking", unit_id: "", lesson_order: 3 },
        { table: "lessons", title: "Clades and More", unit_id: "", lesson_order: 4 },
        //*unit_id = await pool.query("select unit_id from courses where title="Classes of Plants")
        { table: "lessons", title: "Grouping of Plants", unit_id: "", lesson_order: 1 },
        { table: "lessons", title: "Into Angiosperms", unit_id: "", lesson_order: 2 },
        { table: "lessons", title: "Into Gymnosperms", unit_id: "", lesson_order: 3 },
        { table: "lessons", title: "Other Groupings", unit_id: "", lesson_order: 4 },
        //*unit_id = await pool.query("select unit_id from courses where title="Regions")
        { table: "lessons", title: "Overview of Regions", unit_id: "", lesson_order: 1 },
        { table: "lessons", title: "Forests", unit_id: "", lesson_order: 2 }, //taiga,boreal,decidious forest
        { table: "lessons", title: "Deserts", unit_id: "", lesson_order: 3 },
        { table: "lessons", title: "Marine", unit_id: "", lesson_order: 4 },
        { table: "lessons", title: "Tundra", unit_id: "", lesson_order: 5 },
        { table: "lessons", title: "Grasslands", unit_id: "", lesson_order: 6 },
        { table: "lessons", title: "Rain Forests", unit_id: "", lesson_order: 7 },
    ]
}