"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basic_auth = void 0;
const basic_auth = (req, res, next) => {
    let header_list = req.rawHeaders;
    let isAuth = false;
    header_list.forEach(header => {
        if (header.includes('Basic')) {
            if (header.split(' ')[1] === 'YWRtaW46cXdlcnR5') {
                isAuth = true;
            }
        }
    });
    return isAuth ? next() : res.sendStatus(401);
};
exports.basic_auth = basic_auth;
//# sourceMappingURL=basic-auth-middleware.js.map