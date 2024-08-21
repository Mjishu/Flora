import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import * as db from "../db/pool";
import dotenv from "dotenv";

import passport from "passport"
import { Strategy } from "passport-jwt"
import bcrypt from "bcrypt";

dotenv.config();

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.secretOrKey || "secret", //! change
    issuer: process.env.JWT_ISSUER || "accounts.example.com", //! Change this and the above to actual when 
    audience: process.env.FRONTEND_URL || "http://localhost:5173"
};

/*export const configurePassport = (passport: PassportStatic): void => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const { rows } = await db.query("SELECT * FROM users WHERE id = $1;", [jwt_payload.sub])

            if (rows.length > 0) {
                return done(null, rows[0])
            } else {
                return done(null, false)
            }
        } catch (err) {
            return done(err, false);
        }
    }));
};*/

export default passport.use(
    new Strategy({ usernameField: "username" }, async (username, password, done) => {//! usernameField: Might cause issues
        console.log(username)
        try {
            const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [username])
            if (rows.length < 1) throw new Error("User not fouhnd");
            const match = await bcrypt.compare(password, rows[0].password)
            if (!match) throw new Error("Invalid Credentials")
            done(null, rows[0])
        } catch (err) {
            return done(err, null);
        }
    })
)