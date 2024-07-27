"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// C:\Users\Andy\Downloads\testing\my-workspace\server.ts
const express_1 = __importDefault(require("express"));
const models_1 = require("./apps/api/src/models"); // Ensure this path is correct
const auth_1 = __importDefault(require("./apps/api/src/routes/auth")); // Ensure this path is correct
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/test', (req, res) => {
    console.log('Test route hit');
    res.send('Test route working');
});
app.use('/api/auth', (req, res, next) => {
    console.log('Auth routes middleware hit');
    next();
}, auth_1.default);
models_1.sequelize.authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
    return models_1.sequelize.sync();
})
    .then(() => {
    console.log('Database synchronized.');
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
