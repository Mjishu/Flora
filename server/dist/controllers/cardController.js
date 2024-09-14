import dotenv from 'dotenv';
dotenv.config();
export async function cardKnown(req, res) {
    console.log(req.body);
    res.json({ message: "You knew this card" });
}
export async function cardUnknown(req, res) {
    console.log(req.body);
    res.json({ message: "You did not know this card" });
}
