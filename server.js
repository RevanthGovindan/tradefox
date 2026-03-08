import express from "express"
import { SERVER_CONFIGS } from "./src/utils/constants.js"
import { addTrade, getPortfolio } from "./src/controllers/trade.js"

const app = express()

// Middleware
app.use(express.json())

const router = express.Router()
router.post("/trades", addTrade)
router.get("/portfolio", getPortfolio)

app.use(router)

// Start server
app.listen(SERVER_CONFIGS.PORT, () => {
    console.log(`Server running on port ${SERVER_CONFIGS.PORT}`)
})