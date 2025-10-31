import dotenv from "dotenv";
import { Client } from 'pg';
dotenv.config();

class PostgresDBService {
    constructor() {
        this.isConnected = false;
        this.client = null
    }

    async connect() {
        if (this.isConnected) {
            return this.client
        }
        this.client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        await this.client.connect();
        const res = await this.client.query("SELECT NOW()");
        console.log("✅ Connected to Postgres at (UTC TIME):", res.rows[0].now);
        this.isConnected = true;
    }

    async disconnect() {
        if (this.isConnected) {
            await this.client.end();
            this.isConnected = false;
            this.db = null
        }
    }

}

export default new PostgresDBService();