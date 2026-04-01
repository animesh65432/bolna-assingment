import express from "express"
import router from "./router"
import cors from "cors"
import { config } from "./config"

const app = express()

app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}))

app.use(express.json())

app.use(router)

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
})