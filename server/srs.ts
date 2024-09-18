import * as db from "./db/queries.js"

//state is known or not known, N is # seen correctly in a row, eFactor is ease of recall, should output the same values but updated?
/*
    - [x] check if card is new (date is today and n is < 2)
    - [x] if card is new, make a new entry into the user_card_data table with the current users id and the current cards id.
    - [x] else if the card is not new, find that entry in the user_card_data and update the information.
    - [] if the card is seen for the 'first time' on the first day, make the next time it should be seen in 10 minutes~
    - [] use the standard universal time? or whatever the one that is in seconds is? I think this would make it easier for the first day and then whenever I call the date I can 
            Transform it into human readable dates
    - [] if card has a streak >= 1 and then presses unknown: set the interval to 10 minutes OR if its the same day set the interval back down to 1 minute
 */

interface new_card {
    user_id: string;
    card_id: string;
    streak: number;
    interval: number;
    efactor: number;
}

async function cardRelationshipExists(user_id: string, card_id: string, seen: boolean) {
    const cardExists = (await db.getUserCardData(user_id, card_id))[0]

    if (!cardExists) {
        const new_card: new_card = {
            user_id: user_id,
            card_id: card_id,
            streak: seen ? 1 : 0,
            interval: seen ? 0.00695 : 0.000695, // 1.0 = 24hours; to get time in minutes do 1440 / interval. if interval > 1.0 => multiple by 1.0?
            efactor: 2.5, //* min of 1.3 max of 2.5~
        }
        await db.insertUserCardData(new_card);
        return
    }
    if (seen) {
        let newInterval = cardExists.interval
        if (isToday(cardExists.date_created)) {
            if (cardExists.streak + 1 >= 2) {
                newInterval = 1.0
            }
        }
        await db.updateCardRelationStreak(cardExists.streak + 1, newInterval, cardExists.user_id, cardExists.card_id);
    }
}

function isToday(timestampInSeconds: number) {
    const date = new Date(timestampInSeconds * 1000);
    const today = new Date()

    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}

export async function srsFunc(user_id: string, card_id: string, seen: boolean) {
    await cardRelationshipExists(user_id, card_id, seen);


    // //if known:
    // const newEFactor = previous.eFactor - .1;


    // return {
    //     new: isNew,
    //     N: newN,
    //     eFactor: newEFactor,
    //     data: { interval: 1.0 }
}
