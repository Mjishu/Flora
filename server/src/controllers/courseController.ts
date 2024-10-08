import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../db/plantQueries.js";
import * as pool from "../db/pool.js"
import { Client } from "pg";
import { Response, Request } from "express"
import * as srs from "../srs.js";

export async function get_all_courses(req: Request, res: Response) {
    try {
        const { rows } = await pool.query("SELECT * FROM courses", []);
        if (!rows) { return res.status(500).json({ success: false, message: "No courses found" }) }
        res.json(rows)
    } catch (error) {
        console.log(`Error getting all courses: ${error}`)
        res.status(500).json({ message: "error fetching courses", success: false })
    }
}

//todo: this gets the lessons but it doesnt show all the units it groups by unit but not the unit details
//? to fix: array thats different for units,lessons and challenges and return them seperately?
export async function get_courses(req: Request, res: Response) {
    try {
        console.log("get_courses called")
        const course_id = req.params.id;
        const { rows } = await pool.query("SELECT * FROM courses WHERE id = $1", [course_id])
        if (!rows || !rows[0]) {
            res.status(400).json({ message: "Course_id does not match a course", success: false })
            return
        }
        const { lessons, units } = await get_units(rows[0].id)
        res.json({ courses: rows[0].id, units: units, lessons: lessons })
    } catch (error) {
        console.log(`errror getting courses: ${error}`)
        res.status(500).json({ message: "error getting courses", success: false })
    }
}

async function get_units(course_id: string) {
    try {

        const { rows } = await pool.query("SELECT * FROM units WHERE course_id = $1", [course_id]);
        const lessons = []
        if (!rows) { return }
        else {
            console.log(`rows of get_units is `, rows)
            for (let i = 0; i < rows.length; i++) {
                lessons.push(await get_lessons(rows[i].id))
            }
            return { lessons, units: rows }
        }
    } catch (error) {
        console.log(`Error in get_units: ${error}`)
        return
    }
}

async function get_lessons(unit_id: string) { //! This is returning an empty list []
    try {
        console.log(`unit id is ${unit_id}`)
        const { rows } = await pool.query("SELECT * FROM lessons WHERE unit_id = $1", [unit_id]);
        const challenges = []
        if (!rows) { return }
        else {
            console.log(`rows of get_lessons is `, rows)
            return rows
            // for (let i = 0; i < rows.length; i++) {
            //     challenges.push(await get_challenges(rows[i].id))
            // }
            // return challenges
        }
    } catch (error) {
        console.log(`error in get_lessons: ${error}`)
        return
    }
}

async function get_challenges(lesson_id: string) {
    try {
        console.log(`lesson id for challenges is ${lesson_id}`)
        const { rows } = await pool.query("SELECT * FROM challenges WHERE lesson_id = $1", [lesson_id]);
        if (!rows) { return }
        console.log(`rows of get_challenges is `, rows)
        return rows
    } catch (error) {
        console.log(`error in get_challenges: ${error}`)
        return
    }
}