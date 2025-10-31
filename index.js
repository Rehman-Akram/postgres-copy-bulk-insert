import express from "express"
import fs from "fs"
import postgresDbService from "./database/index.js"
import path from "path"
import csv from "fast-csv";



const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.json("Server is working fine. This is my health check end point.");
});

app.post('/dump-data-copy-operation', async (req, res) => {
    const client = await postgresDbService.connect()
    const filePath = path.resolve("data/2LacData.csv");

    const query = `
        COPY data(
        "search-keyword",
        "search-term",
        "search-terms-match-type",
        "campaign-bid-strategy-type",
        conversions,
        "currency-code",
        cost,
        "cost-conv",
        clicks,
        ctr,
        "conv-value",
        "true-view-avg-cpv",
        "trueView-views",
        "Impr"
    )
    FROM '${filePath}' WITH (FORMAT csv, HEADER true, DELIMITER ',')
  `;
    const start = process.hrtime.bigint();
    await client.query(query)
    const end = process.hrtime.bigint(); // high-precision end
    const elapsedNs = end - start; // nanoseconds
    const elapsedMs = Number(elapsedNs) / 1_000_000; // convert to ms

    console.log("✅ COPY completed successfully.");
    console.log(`⏱️ Time elapsed: ${elapsedMs.toFixed(3)} ms (${(elapsedMs / 1000).toFixed(3)} seconds)`);

    res.json({ status: "File dumped successfully" })

})

app.post('/dump-data-batch-insert', async (req, res) => {
    const client = await postgresDbService.connect();
    const filePath = path.resolve("data/2LacData.csv");
    const start = process.hrtime.bigint();
    const batchSize = 2000;

    const columns = [
        "search-keyword",
        "search-term",
        "search-terms-match-type",
        "campaign-bid-strategy-type",
        "conversions",
        "currency-code",
        "cost",
        "cost-conv",
        "clicks",
        "ctr",
        "conv-value",
        "true-view-avg-cpv",
        "trueView-views",
        "Impr"
    ];

    let batch = [];

    // helper to insert safely
    async function insertBatch(batch) {
        if (batch.length === 0) return;

        const placeholders = batch
            .map(
                (_, i) =>
                    `(${columns
                        .map((_, j) => `$${i * columns.length + j + 1}`)
                        .join(", ")})`
            )
            .join(",\n");

        const values = batch.flatMap(row =>
            columns.map(col => row[col] ?? null) // handle undefined/null
        );
        console.log('parameter values', values.length)


        const query = `
      INSERT INTO data(${columns.map(c => `"${c}"`).join(", ")})
      VALUES ${placeholders}
    `;

        await client.query(query, values);
    }

    const stream = fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true, delimiter: ',' }));

    for await (const row of stream) {
        batch.push(row);

        if (batch.length >= batchSize) {
            await insertBatch(batch);
            batch = [];
        }
    }

    // Insert remaining rows
    if (batch.length > 0) {
        await insertBatch(batch);
    }

    const end = process.hrtime.bigint();
    const elapsedNs = end - start;
    const elapsedMs = Number(elapsedNs) / 1_000_000;

    console.log("✅ Bulk insert completed successfully.");
    console.log(`⏱️ Time elapsed: ${elapsedMs.toFixed(3)} ms (${(elapsedMs / 1000).toFixed(3)} seconds)`);

    res.json({ status: "File dumped successfully" });
});


// Graceful shutdown


process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    await postgresDbService.disconnect();
    process.exit(0);
});

app.listen(3000, async () => {
    console.debug("Connecting db")
    await postgresDbService.connect()
    console.debug("Server is running on port 3000");
});

