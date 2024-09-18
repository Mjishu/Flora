import * as db from "./db/queries.js";
async function cardRelationshipExists(user_id, card_id, seen) {
    const cardExists = (await db.getUserCardData(user_id, card_id))[0];
    if (!cardExists) {
        const new_card = {
            user_id: user_id,
            card_id: card_id,
            streak: seen ? 1 : 0,
            interval: 0.0,
            efactor: 2.5, //* min of 1.3 max of 2.5~
        };
        await db.insertUserCardData(new_card);
        return;
    }
    console.log(cardExists);
    if (seen) {
        await db.updateCardRelationStreak(cardExists.streak + 1, cardExists.user_id, cardExists.card_id);
    }
}
export async function srsFunc(user_id, card_id, seen) {
    await cardRelationshipExists(user_id, card_id, seen);
    // //if known:
    // const newEFactor = previous.eFactor - .1;
    // return {
    //     new: isNew,
    //     N: newN,
    //     eFactor: newEFactor,
    //     data: { interval: 1.0 }
}
