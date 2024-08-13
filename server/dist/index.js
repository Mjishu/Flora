"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const plantData_1 = __importDefault(require("./routes/plantData"));
app.use("/", plantData_1.default);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
