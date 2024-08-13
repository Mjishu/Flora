import asyncHandler from "express-async-handler"
import dotenv from 'dotenv'
dotenv.config()

export const floridaTrees = asyncHandler(async (req, res, next) => {
    const url = `https://trefle.io/api/v1/plants?token=${process.env.TREFLE_TOKEN}&filter[distribution]=florida&filter[plant_type]=tree`
    const response = await fetch(url)
    const json = await response.json()
    res.send(json.data)
    console.log(json.data.length)
})