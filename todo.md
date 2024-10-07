# TODO

## Plan

- dates will ALWAYS be stored in utc/gmt time and then when querying, query that time into the users set timezone(date_created is 2024-10-05 19:26:41, then it will convert that utc time to the users local time so ETC = 2024-10-05 14:26:41)

## General IMPORTANT ONES HERE

- [ ] ix dependencies?(Crypto,iunflight,npmlog,rimraf,glob,are-we-there-yet,gauge)

## Frontend

-[x] when you finish all quizzes show a screen to say so

## Backend

-[x] Fix all the sql queries especially for plants

-[ ] Make it more targeted for quizzes? (do i make lessons for different plants? and put the quizzes there? or what do i do with the quizzes)

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
