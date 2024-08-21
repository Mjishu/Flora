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
const passport_jwt_1 = require("passport-jwt");
const db = __importStar(require("../db/pool"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_2 = require("passport-jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.secretOrKey || "secret", //! change
    issuer: process.env.JWT_ISSUER || "accounts.example.com", //! Change this and the above to actual when 
    audience: process.env.FRONTEND_URL || "http://localhost:5173"
};
/*export const configurePassport = (passport: PassportStatic): void => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const { rows } = await db.query("SELECT * FROM users WHERE id = $1;", [jwt_payload.sub])

            if (rows.length > 0) {
                return done(null, rows[0])
            } else {
                return done(null, false)
            }
        } catch (err) {
            return done(err, false);
        }
    }));
};*/
exports.default = passport_1.default.use(new passport_jwt_2.Strategy({ usernameField: "username" }, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(username);
    try {
        const { rows } = yield db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (rows.length < 1)
            throw new Error("User not fouhnd");
        const match = yield bcrypt_1.default.compare(password, rows[0].password);
        if (!match)
            throw new Error("Invalid Credentials");
        done(null, rows[0]);
    }
    catch (err) {
        return done(err, null);
    }
})));
