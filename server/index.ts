import express from "express"
import cors from "cors"

const app = express()
const port = process.env.PORT || 3000
app.use(cors())

import plantData from "./routes/plantData"

app.use("/api/", plantData)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})