"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = exports.getUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = __importStar(require("../db/pool"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.getUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db.query('SELCECT * FROM users WHERE username = $1', [req.params.username]);
    res.send("User is getting ready!");
}));
exports.createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db.query("SELECT * FROM users WHERE username = $1", [req.body.username]);
    if (user.rows[0]) {
        res.json({ message: "fail", user: user });
        console.log("user already exists");
        return;
    }
    const body = req.body;
    const hash = yield bcrypt_1.default.hash(body.password, 10);
    const newUser = {
        username: body.username,
        password: hash, //!Change to BCRYPT
        email: body.email,
    };
    const userEntry = yield db.query('INSERT INTO users (username,password,email) VALUES ($1,$2,$3) RETURNING *', [newUser.username, newUser.password, newUser.email]);
    if (userEntry.rows[0]) {
        res.json({ message: "success" });
    }
    else {
        res.json({ message: "fail" });
    }
}));
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("recieved login details");
    //need to create user first and then make a call to db searching for user
    const userPassword = yield db.query('SELECT password FROM users WHERE username = $1', [req.body.username]);
    if (!userPassword) {
        res.json({ message: "fail" });
        console.log("incorrect username");
        return;
    }
    const match = yield bcrypt_1.default.compare(req.body.password, userPassword);
    if (!match) {
        res.json({ message: "fail" });
        console.log("incorrect password");
        return;
    }
    res.json({ message: `logging in user ${req.body.username}` });
}));
