import * as db from "./db/plantQueries.js";
import * as pool from "./db/pool.js";

interface new_card {
    user_id: string;
    creature_id: string;
    streak: number;
    interval: number;
    efactor: number;
}

interface get_card extends new_card {
    date_created: Date;
    last_seen: Date;
}

export async function srsFunc(user_id: string, creature_id: string, seen: boolean) {
    await cardRelationshipExists(user_id, creature_id, seen);
    //await readyForReview(user_id, card_id);
}

function eFactorEquation(eFactor: number, Quality: number) {
    return eFactor + (0.1 - (5 - Quality) * (0.08 + (5 - Quality) * 0.02))
}

async function cardRelationshipExists(user_id: string, creature_id: string, seen: boolean): Promise<void> { //? Not updating last_seen
    const card: get_card = (await db.getUserCardData(user_id, creature_id))[0]

    if (!card) {
        try {
            const new_card: new_card = {
                user_id: user_id,
                creature_id: creature_id,
                streak: seen ? 1 : 0,
                interval: seen ? 0.00695 : 0.000695, //* 1.0 = 24hours; to get time in minutes do 1440 / interval. if interval > 1.0 => multiple by 1.0?
                efactor: 2.5, //* min of 1.3 max of 2.5~
            }
            await db.insertUserCardData(new_card);
            return
        } catch (error) {
            console.error(`There was an error creating a new card! ${error}`)
            return
        }
    }
    try {
        if (seen) {

            let newInterval = card.interval;
            let newEfactor = card.efactor;
            if (isToday(card.date_created)) {
                if (card.streak + 1 >= 2) {
                    newInterval = 1.0
                } else if (card.streak + 1 === 1) {
                    newInterval = 0.00695
                }
            } else { //! This should change to a deeper srs function but for now it should work?
                newEfactor = eFactorEquation(card.efactor, 3)
                if (newEfactor > 2.5) {
                    newEfactor = 2.5
                } else if (newEfactor < 1.3) {
                    newEfactor = 1.3
                }
                newInterval = card.interval + 1
            }
            await db.updateCardRelationStreak(card.streak + 1, newInterval, card.user_id, card.creature_id, seen, newEfactor);
        }
        else if (!seen) {
            let newInterval: number = card.interval;
            let newStreak: number = card.streak;
            let newEfactor = card.efactor
            if (isToday(card.date_created)) {
                newInterval = 0.000695;
                newStreak = 0;
            } else {
                newInterval = 0.00695;
                newStreak = 0;
                newEfactor = eFactorEquation(card.efactor, 1)
                if (newEfactor < 1.3) { newEfactor = 1.3 }
            }
            await db.updateCardRelationStreak(newStreak, newInterval, card.user_id, card.creature_id, seen, newEfactor);
        }
    } catch (error) {
        console.error(`Error updating user_card_data: ${error}`)
        return
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

export async function readyForReview(user_id: string, limit: number) {//* could make this universal by making db.---(user_id) and the ---- is a paramater passed down?
    const cardsReady = await db.cardsReady(user_id);
    const unseenCards = await db.unseenCards(user_id, limit);
    const cards = cardsReady.concat(unseenCards);
    return cards
}