import { Pool } from "pg";

const pool = new Pool({
    user: "root",
    host: "localhost",
    database: "flora",
    password: "root",
    port: 5432,
})

export default pool