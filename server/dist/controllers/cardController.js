import dotenv from 'dotenv';
dotenv.config();
import * as srs from "../srs.js";
export async function cardKnown(req, res) {
    srs.srsFunc(req.user.id, req.body.card_id, req.body.seen);
    res.json({ message: "You knew this card" });
}
export async function cardUnknown(req, res) {
    srs.srsFunc(req.user.id, req.body.card_id, req.body.seen);
    res.json({ message: "You did not know this card" });
}
