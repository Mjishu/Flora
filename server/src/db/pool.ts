import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

//* Start GCP SQL 
dotenv.config()

async function initializePool() {
    try {
        const pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })

        console.log("Database connection initialized")
        return pool
    } catch (error) {
        console.error(`Error initializing pool: ${error}`);
        process.exit(1)
    }
}

const pool = await initializePool();

export const query = (text: string, params: any) => {
    return pool.query(text, params)
}

export const getClient = () => {
    return pool.connect()
}