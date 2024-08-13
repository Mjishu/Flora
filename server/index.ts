import express from "express"

const app = express()
const port = process.env.PORT || 3000

import plantData from "./routes/plantData"

app.use("/", plantData)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})