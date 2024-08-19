"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.query = void 0;
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const pool = new Pool({
    user: "root",
    host: "localhost",
    database: "flora",
    password: "root",
    port: 5432,
});
const query = (text, params) => {
    return pool.query(text, params);
};
exports.query = query;
const getClient = () => {
    return pool.connect();
};
exports.getClient = getClient;
