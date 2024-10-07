import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import * as db from "../db/plantQueries.js";
import * as pool from "../db/pool.js"
import { Client } from "pg";
import { Response, Request } from "express"
import * as srs from "../srs.js";


export async function create_quiz_details(req: Request, res: Response) {
    console.log("quiz called")
    const { user_id, quiz_id, score, progress } = req.body
    if (user_id !== req.user?.id) {
        console.log("not the current user")
        return res.status(400).json({ success: false, message: "Not the correct user!" })
    }
    let completed_at
    if (progress === "completed") {
        completed_at = new Date();
    }
    await pool.query("INSERT INTO user_quiz_details(user_id,quiz_id,score,progress,completed_at) values ($1,$2,$3,$4,$5)", [req.user?.id, quiz_id, score, progress, completed_at])//progress is either: pending,completed,in-progress
    return res.status(200).json({ success: true })
}

export async function get_quiz_details(req: Request, res: Response) { //* should select the answers as well
    if (!req.user) { return res.status(400).json({ message: "Not logged in", success: false }) }

    const quiz_details = await pool.query(`SELECT qd.*,p.common_name from quiz_details qd  JOIN user_card_data ucd ON qd.card_id = ucd.card_id JOIN plants p ON qd.card_id = p.id 
        WHERE ucd.user_id = $1`, [req.user.id])

    const answers = []
    for (let i = 0; i < quiz_details.rows.length; i++) {
        const { rows } = await pool.query("SELECT * FROM quiz_details_answers WHERE quiz_id = $1 LIMIT $2", [quiz_details.rows[i].id, 4])//* how to limit to 4 and making n of them have is_correct = true
        answers.push(rows)
    }
    return res.status(200).json({ success: true, answers: answers, user_quiz: quiz_details.rows })
}

export async function insert_quiz_details(req: Request, res: Response) {
    if (!req.user) { return res.status(400).json({ message: "Not logged in", success: false }) }
    const quiz_id = req.params.id
    const score = 1.0
    const progress = "completed"
    //*fetch the entry and then set completed/progress to completed  //? what to do with score? 
    // await pool.query(" user_quiz_details SET progress = 'completed',completed_at = NOW() WHERE quiz_id = $1 AND user_id=$2", [quiz_id, req.user.id]) //* make now() for users timezone?
    //todo How to make this reusable? How can i get the card again and test again?
    await pool.query("INSERT INTO user_quiz_details(user_id,quiz_id,score,progress,completed_at) VALUES ($1,$2,$3,$4, NOW())", [req.user.id, quiz_id, score, progress])
    res.send({ message: "update function called", success: true })
}

export async function get_quiz(req: Request, res: Response) {
    const { course_id } = req.body;
    const { rows } = await pool.query("SELECT * FROM courses WHERE id = $1", [course_id])
    if (!rows || !rows[0]) {
        res.status(400).json({ message: "Course_id does not match a course", success: false })
    }
    res.json(rows[0])
}