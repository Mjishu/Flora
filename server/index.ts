import express from "express"
import cors, { CorsOptions } from "cors"
import createError from "http-errors";
import path from "path"
import http from "http"
import cookieParser from "cookie-parser"
import logger from "morgan"

import dotenv from "dotenv"

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

const allowedOrigins: string[] = [
    "http://localhost:5173"
]

const corsOptions: CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


import plantData from "./routes/plantData"
import userData from "./routes/user"

app.use("/api/plants/", plantData)
app.use("/api/users/", userData)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

