import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import passport from "./auth/passport.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = [
    "http://localhost:5173"
];
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
}));
app.use(passport.initialize());
app.use(passport.session());
import plantData from "./routes/plantData.js";
import userData from "./routes/user.js";
import cardData from "./routes/card.js";
import { fileURLToPath } from "url";
app.use("/api/plants/", plantData);
app.use("/api/users/", userData);
app.use("/api/cards/", cardData);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
