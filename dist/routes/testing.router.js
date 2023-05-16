"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const db_mongo_1 = require("../db/db_mongo");
const interface_html_code_1 = require("../dto/interface.html-code");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/', (req, res) => {
    const result = (0, db_mongo_1.clear_db_mongo)();
    result.then(data => {
        if (data) {
            res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
        }
    });
});
//# sourceMappingURL=testing.router.js.map