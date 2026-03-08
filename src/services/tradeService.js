import { positions, trades } from "../store/tradeStore.js"
import { ACTIONS, LATEST_PRICES } from "../utils/constants.js"

// saves a trade to store
export const recordTrade = (trade) => {
    const { symbol, side, price, quantity } = trade
    if (!positions[symbol]) {
        positions[symbol] = {
            quantity: 0,
            avgPrice: 0,
            realizedPnL: 0
        }
    }

    const pos = positions[symbol]
    let tradeQty = quantity
    if (side === ACTIONS.BUY) {
        // If currently short, close short first
        if (pos.quantity < 0) {
            const closingQty = Math.min(Math.abs(pos.quantity), tradeQty)
            pos.realizedPnL += (pos.avgPrice - price) * closingQty
            pos.quantity += closingQty
            tradeQty -= closingQty
        }

        // Remaining qty becomes new long
        if (tradeQty > 0) {
            const totalCost =
                pos.avgPrice * pos.quantity + price * tradeQty
            pos.quantity += tradeQty
            pos.avgPrice = pos.quantity !== 0
                ? totalCost / pos.quantity
                : 0
        }

    } else if (side === ACTIONS.SELL) {
        // If currently long, close long first
        if (pos.quantity > 0) {
            const closingQty = Math.min(pos.quantity, tradeQty)
            pos.realizedPnL += (price - pos.avgPrice) * closingQty
            pos.quantity -= closingQty
            tradeQty -= closingQty
        }

        // Remaining qty becomes short
        if (tradeQty > 0) {
            const totalCost =
                pos.avgPrice * Math.abs(pos.quantity) + price * tradeQty
            pos.quantity -= tradeQty
            pos.avgPrice = Math.abs(pos.quantity) !== 0
                ? totalCost / Math.abs(pos.quantity)
                : 0
        }
    }

    // Store trade history
    if (!trades[symbol]) {
        trades[symbol] = [trade]
    } else {
        trades[symbol].push(trade)
    }

    return trade
}


export const getPositions = () => {
    const response = []
    for (const symbol in positions) {
        const pos = positions[symbol]
        response.push({
            symbol,
            quantity: pos.quantity,
            avgPrice: pos.avgPrice,
            realizedPnL: pos.realizedPnL,
            trades: trades[symbol] || []
        })
    }
    return response
}



export const calculatePnL = () => {
    let realizedPnL = 0
    let unrealizedPnL = 0

    for (const symbol in positions) {
        const pos = positions[symbol]
        const marketPrice = LATEST_PRICES[symbol]
        realizedPnL += pos.realizedPnL
        unrealizedPnL +=
            (marketPrice - pos.avgPrice) * pos.quantity
    }

    return {
        realizedPnL,
        unrealizedPnL
    }
}