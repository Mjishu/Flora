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
    const { quiz_id } = req.body

    const user_join_quiz = await pool.query("SELECT * FROM user_quiz_details WHERE user_id = $1 AND quiz_id = $2", [req.user?.id, quiz_id])
    const quiz_answers = await pool.query("SELECT * FROM quiz_details_answers WHERE quiz_id = $1 LIMIT $2", [quiz_id, 4])//* how to limit to 4 and making n of them have is_correct = true
    return res.status(200).json({ success: true, answers: quiz_answers.rows, user_quiz: user_join_quiz.rows })
}

export async function update_quiz_details(req: Request, res: Response) {
    if (!req.user) { return res.status(400).json({ message: "Not logged in", success: false }) }
    const quiz_id = req.params.id
    //*fetch the entry and then set completed/progress to completed  //? what to do with score? 
    await pool.query("UPDATE user_quiz_details SET progress = 'completed',completed_at = NOW() WHERE quiz_id = $1 AND user_id=$2", [quiz_id, req.user.id]) //* make now() for users timezone?
    res.send({ message: "update function called", success: true })
}