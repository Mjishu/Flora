import * as db from "./db/queries.js";
async function cardRelationshipExists(user_id, card_id, seen) {
    const card = (await db.getUserCardData(user_id, card_id))[0];
    if (!card) {
        const new_card = {
            user_id: user_id,
            card_id: card_id,
            streak: seen ? 1 : 0,
            interval: seen ? 0.00695 : 0.000695, //* 1.0 = 24hours; to get time in minutes do 1440 / interval. if interval > 1.0 => multiple by 1.0?
            efactor: 2.5, //* min of 1.3 max of 2.5~
        };
        await db.insertUserCardData(new_card);
        return;
    }
    if (seen) {
        let newInterval = card.interval;
        if (isToday(card.date_created)) {
            if (card.streak + 1 >= 2) {
                newInterval = 1.0;
            }
            else if (card.streak + 1 == 1) {
                newInterval = 0.00695;
            }
        }
        else {
            //todo do some magic bc card was not seen first time today.
        }
        await db.updateCardRelationStreak(card.streak + 1, newInterval, card.user_id, card.card_id);
    }
    else if (!seen) {
        let newInterval = card.interval;
        let newStreak = card.streak;
        if (isToday(card.date_created)) {
            newInterval = 0.000695;
            newStreak = 0;
        }
        else {
            newInterval = 0.00695;
            newStreak = 0;
        }
        await db.updateCardRelationStreak(newStreak, newInterval, card.user_id, card.card_id);
    }
}
function isToday(date) {
    const today = new Date();
    return (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear());
}
export async function srsFunc(user_id, card_id, seen) {
    await cardRelationshipExists(user_id, card_id, seen);
    //await readyForReview(user_id, card_id);
}
export async function readyForReview(user_id, card_id) {
    //? If i call it just on card change youd never see the card again
    const result = await db.last_seenToUnix(card_id, user_id);
    const lastSeenUnix = Math.floor(parseFloat(result[0].last_seen_unix));
    const unixNow = Math.floor(new Date().getTime() / 1000);
    const intervalInMs = Math.floor(result[0].interval * 24 * 60 * 60);
    const nextReview = lastSeenUnix + intervalInMs; //* todo.md backend #1
    if (unixNow >= nextReview) {
        console.log("review is ready");
    }
    //todo interval to ms add that ms to lastSeenUnix
    if (!result) {
        console.log("Card not found");
        return;
    }
    console.log(`unix for last_seen is ${lastSeenUnix}\ntime now is ${unixNow}\ninterval is ${intervalInMs}`);
    console.log("next review is in ", nextReview);
}
