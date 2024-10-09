import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../db/plantQueries.js";
import * as pool from "../db/pool.js"
import { Client } from "pg";
import { Response, Request } from "express"
import * as srs from "../srs.js";

interface Lesson {
    id: string;
    title: string;
    unit_id: string;
    lesson_order: number;
}

interface Unit {
    id: string;
    title: string;
    description: string;
    course_id: string;
    unit_order: number;
    lessons: Lesson[];
}

interface Challenge {
    id: string;
    lesson_id: string;
    challenge_order: string;
    description: string
}

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

export async function get_courses(req: Request, res: Response) {
    try {
        const course_id = req.params.id;
        const { rows } = await pool.query("SELECT * FROM courses WHERE id = $1", [course_id])
        if (!rows || !rows[0]) {
            res.status(400).json({ message: "Course_id does not match a course", success: false })
            return;
        }
        const unit_lessons = await get_units(rows[0].id)
        if (!unit_lessons) {
            res.status(500).json({ message: "Error getting lessons" })
            return
        }
        const { units, lessons } = unit_lessons;
        res.json({ courses: rows[0].id, units, lessons })
    } catch (error) {
        console.log(`errror getting courses: ${error}`)
        res.status(500).json({ message: "error getting courses", success: false })
    }
}

async function get_units(course_id: string) {
    try {
        const { rows } = await pool.query("SELECT * FROM units WHERE course_id = $1", [course_id]);
        if (!rows) { return }
        const lessons = []

        for (const unit of rows) {
            lessons.push(await get_lessons(unit.id))
        }
        return { lessons, units: rows }
    } catch (error) {
        console.log(`Error in get_units: ${error}`)
        return
    }
}

async function get_lessons(unit_id: string) {
    try {
        const { rows } = await pool.query("SELECT * FROM lessons WHERE unit_id = $1", [unit_id]);
        if (!rows) { return [] }

        const lesson_with_challenges: Challenge[] | undefined = []
        // for (const lesson from rows) {
        //     const challenges = await get_challenges(lesson.id);
        //     lesson_with_challenges.push({...lesson,challenges,})
        // }
        return rows;
    } catch (error) {
        console.log(`error in get_lessons: ${error}`)
        return
    }
}

async function get_challenges(lesson_id: string) {
    try {
        const { rows } = await pool.query("SELECT * FROM challenges WHERE lesson_id = $1", [lesson_id]);
        if (!rows) { return }
        return rows
    } catch (error) {
        console.log(`error in get_challenges: ${error}`)
        return
    }
}