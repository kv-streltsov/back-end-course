"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/', (req, res) => {
    (0, db_1.clear_db)();
    res.sendStatus(204);
});
//# sourceMappingURL=testing.router.js.map