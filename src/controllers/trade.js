const trades = []

export const addTrade = (req, res) => {
    try {
        const { id, symbol, side, price, quantity, timestamp } = req.body

        if (!id || !symbol || !side || !price || !quantity || !timestamp) {
            return res.status(400).json({
                error: "Missing required fields"
            })
        }

        const trade = {
            id,
            symbol,
            side,
            price,
            quantity,
            timestamp
        }

        trades.push(trade)

        res.status(201).json({
            message: "Trade recorded successfully",
            trade
        })

    } catch (err) {
        res.status(500).json({
            error: "Internal server error"
        })
    }
}

export const getPortfolio = (req, res) => {

    const portfolio = {}

    for (const trade of trades) {

        const { symbol, side, price, quantity } = trade

        if (!portfolio[symbol]) {
            portfolio[symbol] = {
                symbol,
                totalQuantity: 0,
                totalCost: 0
            }
        }

        if (side === "buy") {
            portfolio[symbol].totalQuantity += quantity
            portfolio[symbol].totalCost += price * quantity
        }

        if (side === "sell") {
            portfolio[symbol].totalQuantity -= quantity
            portfolio[symbol].totalCost -= price * quantity
        }
    }

    const result = Object.values(portfolio).map(p => ({
        symbol: p.symbol,
        totalQuantity: p.totalQuantity,
        averagePrice: p.totalQuantity
            ? p.totalCost / p.totalQuantity
            : 0
    }))

    res.json(result)
}