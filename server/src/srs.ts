import * as db from "./db/plantQueries.js";
import * as pool from "./db/pool.js";

/*
    * [x] check if card is new (date is today and n is < 2)
    * [x] if card is new, make a new entry into the user_card_data table with the current users id and the current cards id.
    * [x] else if the card is not new, find that entry in the user_card_data and update the information.
    * [x] if the card is seen for the 'first time' on the first day, make the next time it should be seen in 10 minutes~
    * [x] if card has a streak >= 1 and then presses unknown: set the interval to 10 minutes OR if its the same day set the interval back down to 1 minute
    * [ ] send card to front end if it is ready
    * [ ] Check if card is ready to be sent i.e if the interval and date_lastseen matchup, How to add the interval to the last_seen property and check if that time has passed>?
 */

interface new_card {
    user_id: string;
    card_id: string;
    streak: number;
    interval: number;
    efactor: number;
}

interface get_card extends new_card {
    date_created: Date;
    last_seen: Date;
}

async function cardRelationshipExists(user_id: string, card_id: string, seen: boolean): Promise<void> {
    const card: get_card = (await db.getUserCardData(user_id, card_id))[0]

    if (!card) {
        const new_card: new_card = {
            user_id: user_id,
            card_id: card_id,
            streak: seen ? 1 : 0,
            interval: seen ? 0.00695 : 0.000695, //* 1.0 = 24hours; to get time in minutes do 1440 / interval. if interval > 1.0 => multiple by 1.0?
            efactor: 2.5, //* min of 1.3 max of 2.5~
        }
        await db.insertUserCardData(new_card);
        return
    }
    if (seen) {
        let newInterval = card.interval
        if (isToday(card.date_created)) {
            if (card.streak + 1 >= 2) {
                newInterval = 1.0
            } else if (card.streak + 1 == 1) {
                newInterval = 0.00695
            }
        } else {
            //todo do some magic bc card was not seen first time today.
        }
        await db.updateCardRelationStreak(card.streak + 1, newInterval, card.user_id, card.card_id);
    }
    else if (!seen) {
        let newInterval: number = card.interval;
        let newStreak: number = card.streak;
        if (isToday(card.date_created)) {
            newInterval = 0.000695;
            newStreak = 0;
        } else {
            newInterval = 0.00695;
            newStreak = 0;
        }
        await db.updateCardRelationStreak(newStreak, newInterval, card.user_id, card.card_id);
    }
}

function isToday(date: Date): unknown {
    const today = new Date()

    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}

export async function srsFunc(user_id: string, card_id: string, seen: boolean) {
    await cardRelationshipExists(user_id, card_id, seen);
    //await readyForReview(user_id, card_id);
}


export async function readyForReview(user_id: string, limit: number) {//* could make this universal by making db.---(user_id) and the ---- is a paramater passed down?
    const cardsReady = await db.cardsReady(user_id);
    const unseenCards = await db.unseenCards(user_id, limit);
    const cards = cardsReady.concat(unseenCards)
    return cards
}