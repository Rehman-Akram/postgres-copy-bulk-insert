# PostgreSQL COPY vs Bulk Insert Performance Analysis

A Node.js application that compares the performance between PostgreSQL's `COPY` operation and traditional bulk insert methods for large datasets.

## Overview

This project analyzes and benchmarks two different approaches for inserting large amounts of data into PostgreSQL:
- **COPY Operation**: PostgreSQL's native `COPY` command for direct file-to-table data loading
- **Bulk Insert**: Traditional parameterized batch inserts using SQL `INSERT` statements

## Features

- Performance comparison between COPY and bulk insert operations
- RESTful API endpoints for testing both methods
- High-precision timing measurements using `process.hrtime.bigint()`
- Batch processing with configurable batch sizes
- CSV data processing with 200,000 sample records
- Graceful database connection management

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- PostgreSQL database
- CSV data file (sample included: `data/2LacData.csv`)

## Installation

1. Clone the repository:
```bash
git clone git@github.com-rehman:Rehman-Akram/postgres-copy-bulk-insert.git
cd postgres-copy-bulk-insert
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp sample.env .env
```

4. Configure your database connection in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

5. Create the target table in your PostgreSQL database:
```sql
CREATE TABLE data (
    "search-keyword" TEXT,
    "search-term" TEXT,
    "search-terms-match-type" TEXT,
    "campaign-bid-strategy-type" TEXT,
    "conversions" TEXT,
    "currency-code" TEXT,
    "cost" TEXT,
    "cost-conv" TEXT,
    "clicks" TEXT,
    "ctr" TEXT,
    "conv-value" TEXT,
    "true-view-avg-cpv" TEXT,
    "trueView-views" TEXT,
    "Impr" TEXT
);
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000.

## API Endpoints

### Health Check
```
GET /
```
Returns server status.

### COPY Operation Test
```
POST /dump-data-copy-operation
```
Performs data insertion using PostgreSQL's `COPY` command. This method directly loads the CSV file into the database.

### Bulk Insert Test
```
POST /dump-data-batch-insert
```
Performs data insertion using traditional bulk insert with batching (batch size: 2000 records).

## Performance Results

Both endpoints return timing information:
- Execution time in milliseconds
- Execution time in seconds
- Success confirmation

Example response:
```json
{
  "status": "File dumped successfully"
}
```

Console output includes detailed timing:
```
✅ COPY completed successfully.
⏱️ Time elapsed: 1234.567 ms (1.235 seconds)
```

## Project Structure

```
├── data/
│   └── 2LacData.csv          # Sample dataset (200k records)
├── database/
│   └── index.js              # Database connection service
├── index.js                  # Main application server
├── package.json              # Project dependencies
├── sample.env                # Environment template
└── README.md                 # This file
```

## Dependencies

- **express**: Web framework for API endpoints
- **pg**: PostgreSQL client for Node.js
- **fast-csv**: CSV parsing and processing
- **dotenv**: Environment variable management
- **nodemon**: Development server with auto-restart

## Author

Rehman Akram