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
