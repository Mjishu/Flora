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
exports.Meower = exports.floridaTrees = void 0;
exports.getFloridaTrees = getFloridaTrees;
exports.getSRS = getSRS;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = __importStar(require("../db/queries"));
const srs_1 = __importDefault(require("../srs"));
exports.floridaTrees = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //How to put this data in the database?
    res.json({ message: "finding trees" }); //instead of sending this put it db and then send db entries to frontend
}));
function getFloridaTrees(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const common_names = yield db.getAllCommonNames();
        console.log("common_names are ", common_names);
        res.send("common names: " + common_names.map((name) => name.common_name).join(", "));
    });
}
function getSRS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const previous = {
            N: 0, eFactor: 2.5, new: false, data: {}
        };
        const evaluation = {
            lateness: 0, score: 5.0
        };
        res.send((0, srs_1.default)(previous, evaluation));
    });
}
exports.Meower = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json("Im such a meower");
}));
