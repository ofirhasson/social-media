"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = void 0;
const cyber_1 = require("../2-utils/cyber");
const client_errors_1 = require("../3-models/client-errors");
class SecurityMiddleware {
    verifyLoggedIn(request, response, next) {
        const authorizationHeader = request.header("authorization");
        const token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.substring(7);
        if (!cyber_1.cyber.isTokenValid(token)) {
            const err = new client_errors_1.UnauthorizedError("You are not logged in.");
            next(err);
        }
        else {
            next();
        }
    }
    verifyAdmin(request, response, next) {
        const authorizationHeader = request.header("authorization");
        const token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.substring(7);
        if (!cyber_1.cyber.isAdmin(token)) {
            const err = new client_errors_1.UnauthorizedError("You are not authorized.");
            next(err);
        }
        else {
            next();
        }
    }
}
exports.securityMiddleware = new SecurityMiddleware();
