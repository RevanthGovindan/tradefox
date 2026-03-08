import express from "express"
import { SERVER_CONFIGS } from "./src/utils/constants.js"
import { addTrade, getPnL, getPortfolio } from "./src/controllers/tradeController.js"

const app = express()

// Middleware
app.use(express.json())

const router = express.Router()
router.post("/trades", addTrade)
router.get("/portfolio", getPortfolio)
router.get("/pnl", getPnL)

app.use(router)

// Start server
app.listen(SERVER_CONFIGS.PORT, () => {
    console.log(`Server running on port ${SERVER_CONFIGS.PORT}`)
})