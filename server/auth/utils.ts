import jsonwebtoken from "jsonwebtoken";
import fs from "fs"
import path from "path"
import { Request, Response, NextFunction } from "express";
import passport from "passport";

const pathToPriv = path.join("./auth", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPriv, "utf-8");

export function issueJWT(user: any) {
    const id = user.id;
    const expiresIn = "14d";
    const payload = {
        sub: id,
        iat: Date.now()
    };
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: "RS256" })
    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: any, info: any) => { //! Change these from any
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).json({ success: false, message: "unauthorized" })
        }
        req.user = user
        next()
    })(req, res, next);
}