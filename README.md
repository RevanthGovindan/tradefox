# Portfolio & PnL Tracker

A backend service that records trades, tracks portfolio holdings, and
calculates Profit & Loss (PnL).

This project implements a simplified trading portfolio engine where
trades are recorded and positions are updated incrementally in memory.

------------------------------------------------------------------------

## Overview

The service provides three APIs:

1.  **Add Trade** -- Record a trade
2.  **Get Portfolio** -- Retrieve current holdings for each symbol
3.  **Get PnL** -- Calculate realized and unrealized profit/loss

The system stores data **in memory** and uses the **Average Cost
method** to calculate positions and PnL.

------------------------------------------------------------------------

## Tech Stack

-   Node.js
-   Express.js
-   Nodemon
-   OpenAPI (Swagger)
-   Jest (Unit Testing)
-   Docker

------------------------------------------------------------------------

## API Documentation

The API specification is provided using **OpenAPI 3.0**.

File:

openapi.yaml

You can view the API documentation using Swagger UI documentation availabe at:

http://localhost:3000/docs

The OpenAPI specification describes:

-   API endpoints
-   Request payloads
-   Response schemas
-   Example values

------------------------------------------------------------------------

## Data Models

### Trade

{ "id": "1", "symbol": "BTC", "side": "buy", "price": 40000, "quantity":
1, "timestamp": 1710000000 }

### Position

{ "symbol": "BTC", "quantity": 2, "avgPrice": 41000, "realizedPnL": 2000
}

Position states:

-   Long → quantity \> 0
-   Short → quantity \< 0
-   Flat → quantity = 0

------------------------------------------------------------------------

## Position Accounting

Positions are updated **incrementally when trades are recorded**,
instead of recalculating portfolio state on every request.

### Buy Trade

-   Increases position quantity
-   Updates average entry price

### Sell Trade

-   Closes existing long position first
-   Realized PnL is calculated as:

Realized PnL = (sellPrice - avgEntryPrice) \* closedQuantity

Remaining quantity may open a **short position**.

------------------------------------------------------------------------

## Market Prices

Latest prices are defined using a simple in-memory map.

{ BTC: 44000, ETH: 2000 }

These prices are used to calculate **unrealized PnL**.

------------------------------------------------------------------------

## API Endpoints

### Add Trade

POST /trades

Example request:

{ "id": "1", "symbol": "BTC", "side": "buy", "price": 40000, "quantity":
1, "timestamp": 1710000000 }

------------------------------------------------------------------------

### Get Portfolio

GET /portfolio

Example response:

\[ { "symbol": "BTC", "quantity": 2, "avgPrice": 41000, "realizedPnL": 0
}\]

------------------------------------------------------------------------

### Get PnL

GET /pnl

Example response:

{ "realizedPnL": 2000, "unrealizedPnL": 3000 }

------------------------------------------------------------------------

## Running the Project

Install dependencies:

npm install

Start the server:

npm run dev

Server runs on:

http://localhost:3000

------------------------------------------------------------------------

## Running Unit Tests

Unit tests are implemented using **Jest**.

Run tests with:

npm test

The tests verify:

-   Average price calculation after multiple trades
-   Realized PnL after closing positions
-   Unrealized PnL calculation
-   Portfolio position updates

------------------------------------------------------------------------

## Running with Docker

### Build Docker Image

docker build -t tradefox .

### Run Container

docker run -p 3000:3000 tradefox

Server will be available at:

http://localhost:3000

------------------------------------------------------------------------

## Assumptions

-   Single user system
-   Data stored in memory
-   No authentication required
-   Average cost method used for PnL
-   Market prices are hardcoded

------------------------------------------------------------------------

## Possible Improvements

-   Add persistent storage (PostgreSQL / Redis)
-   Add integration tests
-   Add Docker Compose for local development
-   Add validation libraries (Joi / Zod)
-   Add logging and monitoring
