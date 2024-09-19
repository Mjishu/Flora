# TODO

## Plan

    - Instead of calling the is-route on the frontend do this on the backend and then just send the cards that are ready. 
        check the user_card_data table for cards that are ready to show and then send them to the front end 2 options right now:
        1. Send a list of cards to the frontend and then as each card gets seen and answered it gets popped from the list, each time the database gets called
            it checks and sees if there are any new cards to checkout
            pros | cons
            less time waiting for api calls | users can see cards that are coming 
            one call for x amount of cards |
        2. Each time the backend gets called, go through the user_card_data and find a card thats ready and make it a limit of 1, then send that card to the frontend and wait 
            to get a response/request before looking again
            pros  | cons
            less storage on frontend | slower api calls
        I actually dont think itd be slower, because after each response Id still query the database and sql queries are so light weight that it doesnt matter,
            plus id be doing it for option 1 as well. 
        To me #1 makes the most sense now as you can preview the previous ones while also going back? maybe Id have to make 2 arrays one thats up to date and one ready
            for any redo buttons? idk this is in the future implementation
        I could use UseMemo for the 1st implementation on the front end so that it only changes when the array changes? idk if this would be redundant thoughf 

## Frontend

    - [ ] Make home page, should keep in  mind for more tabs. But have a button to click to go to the plants page 

## Backend

    - [ ] Move the fetch statement from the homepage to the backend. The fetch can just happen in the use effect that calls the plants?
    - [ ] Instead of doing all the checking logic in js, it will probably be lighter and faster to do it in sql, I can probably just do last_seen in unix and then convert
        interval to seconds and then add those seconds to get the next review time.
