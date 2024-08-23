import jsonwebtoken from "jsonwebtoken";
import fs from "fs"
import path from "path"

const pathToPriv = path.join("./auth", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPriv, "utf-8");

export function issueJWT(user: any) {
    const id = user.id;
    console.log(id)

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