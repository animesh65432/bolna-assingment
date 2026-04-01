import { Router } from "express"
import { callUser, bolnaWebhook, getReminders } from "../controllers"

const router = Router()

router.post("/call", callUser)
router.post("/bolna-webhook", bolnaWebhook)
router.get("/reminders", getReminders)

export default router