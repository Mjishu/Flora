import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
    user: "root",
    host: "localhost",
    database: "flora",
    password: "root",
    port: 5432,
});
export const query = (text, params) => {
    return pool.query(text, params);
};
export const getClient = () => {
    return pool.connect();
};
