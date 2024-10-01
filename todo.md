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
        I could use UseMemo for the 1st implementation on the front end so that it only changes when the array changes? idk if this would be redundant thought

## General IMPORTANT ONES HERE

- [ ] Once a quiz is done I shouldnt be able to do it for x time? I don't want the quiz to show up after i finish when i reload the page

## Frontend

-[ ] when you finish all quizzes show a screen to say so

-[x] when submit button pressed, go to the next quiz**

- [x] How to go to next card for flashcards

  - [X] Make home page, should keep in  mind for more tabs. But have a button to click to go to the plants page

  - [x] Profile page with editible features

  - [ ] Fix types in Card.tsx OR make a types file and then use the types in each respective file.

  - [ ] using left and right arrow doesnt work right now unless i click the button holding the card? if i click anywhere on the page it doesnt work

## Backend

-[x] Make it so I can create quizzes, right now you just get quizzes I think instead of creating some?
    should i make a new test for the user each time they respond to a new card
-[ ] when one of the questions is answered go to the next question, do this until you run out of cards(that x user has seen)
-[ ] send questions only for cards that are ready? or should cards be able to be seen whenever?

    - [ ] Next_review time should be at  x time on the same day everyday, maybe go for a 2 am approach where Last last_seen + interval Math.floors into the previous 2AM?
            Because every card thats next_review is on the 20th should be viewable at the same time on the 20th, one shouldnt be available at 9am and then next not untill 4pm.
    ** I feel like I have this implemented, im getting true for a date being greater than the next interval time BUT the card isnt sending in the test? so
        im not sure whats wrong. I prob just need to sleep on it

    - [ ] changing timezone doesnt change when you see a card, i.e seeing a new card and going from london -> tokyo doesnt update when you see x card

### efactor calculation (supermemo2)

    1. 
        l(1):=1
        l(2):=6
        for n > 2: l(n):=l(n-1)*EF
    2. 
        New E-factor formula: EF':= EF + (0.1-(5-q)*(0.08+(5-q)*0.02))
        EF' = new ease factor | EF old ease factor | q quality of response(time taken, or more weight to some answers) | if EF < 1.3 ef = 1.3. 

## Issues

-Misstype in Sago Palm description: typicall about 20cm in diameter
