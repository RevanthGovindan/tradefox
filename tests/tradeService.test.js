import { recordTrade, calculatePnL, getPositions } from "../src/services/tradeService.js"
import { positions, trades } from "../src/store/tradeStore.js"

beforeEach(() => {
    // reset memory store
    for (const key in positions) delete positions[key]
    for (const key in trades) delete trades[key]
})

test("should calculate average price correctly after multiple buys", () => {

    recordTrade({
        id: "1",
        symbol: "BTC",
        side: "buy",
        price: 40000,
        quantity: 1,
        timestamp: 1
    })

    recordTrade({
        id: "2",
        symbol: "BTC",
        side: "buy",
        price: 42000,
        quantity: 1,
        timestamp: 2
    })

    const portfolio = getPositions()

    expect(portfolio[0].quantity).toBe(2)
    expect(portfolio[0].avgPrice).toBe(41000)
})

test("should calculate realized pnl after sell", () => {

    recordTrade({
        id: "1",
        symbol: "BTC",
        side: "buy",
        price: 40000,
        quantity: 1,
        timestamp: 1
    })

    recordTrade({
        id: "2",
        symbol: "BTC",
        side: "sell",
        price: 42000,
        quantity: 1,
        timestamp: 2
    })

    const pnl = calculatePnL()

    expect(pnl.realizedPnL).toBe(2000)
})

test("should calculate unrealized pnl correctly", () => {

    recordTrade({
        id: "1",
        symbol: "BTC",
        side: "buy",
        price: 40000,
        quantity: 1,
        timestamp: 1
    })

    const pnl = calculatePnL()

    expect(pnl.unrealizedPnL).toBeGreaterThan(0)
})

test("should handle position flip from long to short", () => {

    recordTrade({
        id: "1",
        symbol: "BTC",
        side: "buy",
        price: 40000,
        quantity: 1,
        timestamp: 1
    })

    recordTrade({
        id: "2",
        symbol: "BTC",
        side: "sell",
        price: 42000,
        quantity: 2,
        timestamp: 2
    })

    const portfolio = getPositions()

    expect(portfolio[0].quantity).toBe(-1)
})