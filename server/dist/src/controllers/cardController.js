import dotenv from 'dotenv';
dotenv.config();
import * as srs from "../srs.js";
export async function cardKnown(req, res) {
    if (!req.user) {
        res.json({ message: "User is not logged in", success: false });
        return;
    }
    srs.srsFunc(req.user.id, req.body.card_id, req.body.seen);
    res.json({ message: "You knew this card" });
}
export async function cardUnknown(req, res) {
    if (!req.user) {
        res.json({ message: "User is not logged in", success: false });
        return;
    }
    srs.srsFunc(req.user.id, req.body.card_id, req.body.seen);
    res.json({ message: "You did not know this card" });
}
export async function isCardReady(req, res) {
    console.log("is card ready was called!");
    if (!req.user) {
        res.json({ message: "User is not logged in", success: false });
        return;
    }
    srs.readyForReview(req.user.id, req.body.card_id);
}
