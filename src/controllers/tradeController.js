import { recordTrade, getPositions, calculatePnL } from "../services/tradeService.js"
import { validateTrade } from "../validations/tradeValidator.js"

export const addTrade = (req, res) => {
    const error = validateTrade(req.body)
    if (error) {
        return res.status(400).json({ error })
    }

    const trade = recordTrade(req.body)
    res.status(201).json({
        message: "Trade recorded successfully",
        trade
    })
}


export const getPortfolio = (req, res) => {
    const positions = getPositions()
    res.json(positions)
}


export const getPnL = (req, res) => {
    const pnl = calculatePnL()
    res.json(pnl)
}