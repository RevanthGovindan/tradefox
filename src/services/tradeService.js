import { positions, trades } from "../store/tradeStore.js"
import { ACTIONS } from "../utils/constants.js"

// saves a trade to store
export const recordTrade = (trade) => {
    const { symbol, side, price, quantity } = trade

    if (!positions[symbol]) {
        positions[symbol] = {
            quantity: 0,
            avgPrice: 0
        }
    }

    const pos = positions[symbol]
    if (side === ACTIONS.BUY) {
        const totalCost = pos.avgPrice * pos.quantity + price * quantity
        pos.quantity += quantity
        pos.avgPrice = totalCost / pos.quantity
    }

    if (side === ACTIONS.SELL) {
        realizedPnL += (price - pos.avgPrice) * quantity
        pos.quantity -= quantity
    }
    if (!trades[symbol]) {
        trades[symbol] = [trade]
    } else {
        trades[symbol].push(trade)
    }
    return trade
}


export const getPositions = () => {
    let response = []
    for (let sym in positions) {
        let positionObj = { ...positions[sym] }
        positionObj.trades = trades[sym]
        response.push(positionObj)
    }
    return response
}


export const calculatePnL = () => {
    let unrealizedPnL = 0

    for (const symbol in positions) {
        const pos = positions[symbol]
        const marketPrice = LATEST_PRICES[symbol]
        unrealizedPnL += (marketPrice - pos.avgPrice) * pos.quantity
    }

    return {
        realizedPnL,
        unrealizedPnL
    }
}