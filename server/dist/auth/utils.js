import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import path from "path";
import passport from "passport";
const pathToPriv = path.join("./auth", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPriv, "utf-8");
export function issueJWT(user) {
    const id = user.id;
    const expiresIn = "14d";
    const payload = {
        sub: id,
        iat: Date.now()
    };
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: "RS256" });
    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    };
}
export const authenticateJwt = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log("user does not exist?");
            return res.status(401).json({ success: false, message: "unauthorized" });
        }
        req.user = user;
        next();
    })(req, res, next);
};
