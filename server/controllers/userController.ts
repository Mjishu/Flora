import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from "express"

export async function getUser(req: Request, res: Response) {
    res.send("User is getting ready!")
}