export const validateTrade = (trade) => {

    const { id, symbol, side, price, quantity, timestamp } = trade

    if (!id || !symbol || !side || !price || !quantity || !timestamp) {
        return "Missing required fields"
    }

    if (!["buy", "sell"].includes(side)) {
        return "Side must be buy or sell"
    }

    if (price <= 0 || quantity <= 0) {
        return "Price and quantity must be positive"
    }

    return null
}