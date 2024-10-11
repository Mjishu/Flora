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
        const { rows: courseRows } = await pool.query("SELECT * FROM courses WHERE id = $1", [course_id])
        if (!courseRows || !courseRows[0]) {
            res.status(400).json({ message: "Course_id does not match a course", success: false })
            return;
        }
        const unit_lessons = await get_units(course_id)
        if (!unit_lessons) {
            res.status(500).json({ message: "Error getting lessons" })
            return
        }
        const course = {
            id: courseRows[0].id,
            title: courseRows[0].title,
            image_src: courseRows[0].image_src,
            units: unit_lessons
        }
        res.json({ course })
    } catch (error) {
        console.log(`errror getting courses: ${error}`)
        res.status(500).json({ message: "error getting courses", success: false })
    }
}

async function get_units(course_id: string) {
    try {
        const { rows: unitRows } = await pool.query("SELECT * FROM units WHERE course_id = $1", [course_id]);
        if (!unitRows || unitRows.length === 0) { return [] }

        const unitsWithLessons = await Promise.all(unitRows.map(async (unit) => {
            const lessons = await get_lessons(unit.id);
            return {
                id: unit.id,
                title: unit.title,
                description: unit.description,
                unit_order: unit.unit_order,
                course_id: course_id,
                lessons
            };
        }));
        return unitsWithLessons
    } catch (error) {
        console.log(`Error in get_units: ${error}`)
        return
    }
}

async function get_lessons(unit_id: string) {
    try {
        const { rows: lessonRows } = await pool.query("SELECT * FROM lessons WHERE unit_id = $1", [unit_id]);
        if (!lessonRows || lessonRows.length === 0) { return [] }

        const lessonWithChallenges = await Promise.all(lessonRows.map(async (lesson) => {
            const challenges = await get_challenges(lesson.id);
            return {
                id: lesson.id,
                title: lesson.title,
                unit_id: unit_id,
                lesson_order: lesson.lesson_order,
                challenges
            }
        }))

        return lessonWithChallenges
    } catch (error) {
        console.log(`error in get_lessons: ${error}`)
        return
    }
}

async function get_challenges(lesson_id: string) {
    try {
        const { rows: challengeRows } = await pool.query("SELECT * FROM challenges WHERE lesson_id = $1", [lesson_id]);
        if (!challengeRows || challengeRows.length === 0) { return [] }
        const challengesWithAnswers = await Promise.all(challengeRows.map(async (challenge) => {
            // const answers = []//await get_challenge_answers(challenge.id)
            return {
                id: challenge.id,
                lesson_id: lesson_id,
                type: challenge.type,
                challenge_order: challenge.challenge_order
                // answers
            }
        }))
        return challengesWithAnswers
    } catch (error) {
        console.log(`error in get_challenges: ${error}`)
        return
    }
}

export async function get_lesson_data(req: Request, res: Response) {
    const lesson_id = req.params.id;
    try {
        const { rows: lessonRows } = await pool.query("SELECT * FROM lessons WHERE id = $1", [lesson_id]);
        if (!lessonRows || lessonRows.length === 0) { return [] }
        const challenges = await get_challenges(lesson_id) //! this should still be [] because I havent added any challenges to the database
        const lessonData = {
            id: lessonRows[0].id,
            title: lessonRows[0].title,
            unit_id: lessonRows[0].unit_id,
            lesson_order: lessonRows[0].lesson_order,
            challenges
        }
        res.json(lessonData)
    } catch (error) {
        res.status(404).json({ message: `could not find lesson with id:${lesson_id}| ${error}`, success: false })
    }
}