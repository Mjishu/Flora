import express from "express"
import cors, { CorsOptions } from "cors"
import createError from "http-errors";
import path from "path"
import http from "http"
import cookieParser from "cookie-parser"
import logger from "morgan"

import session from "express-session";
import passport from "./auth/passport.js";
import { pool } from "./src/db/pool.js"


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

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET || "secret", //! Make this more secure?
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 6000 * 60 }
}))

app.use(passport.initialize());
app.use(passport.session());


import plantData from "./src/routes/plantData.js";
import userData from "./src/routes/user.js";
import cardData from "./src/routes/card.js";
import courseData from "./src/routes/courses.js"
import { fileURLToPath } from "url";

app.use("/api/plants/", plantData);
app.use("/api/users/", userData);
app.use("/api/cards/", cardData)
app.use("/api/courses/", courseData)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

//* Shuts down pool

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing database pool');
    pool.end(() => {
        console.log('Database pool has been closed');
        process.exit(0);  // Exiting the process after the pool is closed
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing database pool');
    pool.end(() => {
        console.log('Database pool has been closed due to interruption');
        process.exit(0);  // Exiting the process after the pool is closed
    });
});