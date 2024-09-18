import * as db from "./db/queries.js";
async function cardRelationshipExists(user_id, card_id, seen) {
    const cardExists = (await db.getUserCardData(user_id, card_id))[0];
    if (!cardExists) {
        const new_card = {
            user_id: user_id,
            card_id: card_id,
            streak: seen ? 1 : 0,
            interval: seen ? 0.00695 : 0.000695, // 1.0 = 24hours; to get time in minutes do 1440 / interval. if interval > 1.0 => multiple by 1.0?
            efactor: 2.5, //* min of 1.3 max of 2.5~
        };
        await db.insertUserCardData(new_card);
        return;
    }
    if (seen) {
        let newInterval = cardExists.interval;
        if (isToday(cardExists.date_created)) {
            if (cardExists.streak + 1 >= 2) {
                newInterval = 1.0;
            }
        }
        await db.updateCardRelationStreak(cardExists.streak + 1, newInterval, cardExists.user_id, cardExists.card_id);
    }
}
function isToday(timestampInSeconds) {
    const date = new Date(timestampInSeconds * 1000);
    const today = new Date();
    return (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear());
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
