import * as db from "./db/queries.js"

interface srsInterface {
    n: number, //if 0 means state would be false, aka not known (if card is to be known, n should be atleast 2 before setting to next day?)
    eFactor: number,
    interval: number,
    //data: object | null,
}

interface evaluationInterface {
    score: number,
    lateness: number
}

//* Previous in SRS is the data returned the last time the function was ran on the card(or if first time set to default values)

//state is known or not known, N is # seen correctly in a row, eFactor is ease of recall, should output the same values but updated?
/*
    - [] check if card is new (date is today and n is < 2)
    - [] if card is new, make a new entry into the user_card_data table with the current users id and the current cards id.
    - [] else if the card is not new, find that entry in the user_card_data and update the information.
    - [] if the card is seen for the 'first time' on the first day, make the next time it should be seen in 10 minutes~
    - [] use the standard universal time? or whatever the one that is in seconds is? I think this would make it easier for the first day and then whenever I call the date I can 
            Transform it into human readable dates
    - [] 
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
            interval: 0.0,
            efactor: 2.5, //* min of 1.3 max of 2.5~
        }
        await db.insertUserCardData(new_card);
        return
    }
    console.log(cardExists)
    if (seen) {
        await db.updateCardRelationStreak(cardExists.streak + 1, cardExists.user_id, cardExists.card_id)
    }
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
