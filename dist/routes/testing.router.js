"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const db_mongo_1 = require("../db/db_mongo");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/', (req, res) => {
    const result = (0, db_mongo_1.clear_db_mongo)();
    result.then(data => {
        if (data) {
            res.sendStatus(204);
        }
    });
});
//# sourceMappingURL=testing.router.js.map