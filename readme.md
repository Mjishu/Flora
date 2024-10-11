# Flora

## How To run

### Client

`bash
    cd client/
    npm run dev
`

### Server

`bash
    cd server/
    npm run serve
`

#### GCP SQL

`bash
    cd server/
    export GOOGLE_APPLICATION_CREDENTIALS=../secrets/GCP/flora-437515-377b7fd09f84.json
    ./cloud_sql_proxy -instances=CONNECTION_NAME=tcp:5432
`
if error run :
sudo lsof -i :5432
sudo kill -9 pid

## relations

users <-> courses (users can have many courses,courses have many users) | user_courses

creatures <-> habitats(creatures can have many habitats) | creature_habitats

creatures <-> regions | creature_regions

creatures <-> sub_regions | creature_sub_regions
