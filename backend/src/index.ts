import express from "express"
import router from "./router"
import cors from "cors"
import { config } from "./config"

const app = express()

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}))

app.use(express.json())

app.use(router)


export default app