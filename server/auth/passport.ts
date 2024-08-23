import * as db from "../db/pool.js";
import path from "path";
import fs from "fs";

import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import passport from "passport";


const pathToKey = path.join("./auth", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf-8");


const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY, //? Change to env variable?
    algorithms: ['RS256']
};

/*const strategy = new JwtStrategy(options, async (payload, done) => {
    console.log(`payload is: ${payload}`)
    try {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [payload.sub])
        if (user.rows[0]) {
            return done(null, user.rows[0])
        } else {
            return done(null, false)
        }
    } catch (err) {
        console.log("there was an error with the jwt strategy")
        return done(err, null)
    }
})

export const usePassportStrategy = (passport: PassportStatic) => {
    passport.use("jwt", strategy)
}*/

passport.use(
    new JwtStrategy(options, async (payload, done) => {
        try {
            const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [payload.sub])
            if (rows.length > 0) {
                return done(null, rows[0])
            } else {
                return done(null, false)
            }
        } catch (err) { return done(err, false) }
    })
)

export default passport;