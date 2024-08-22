"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
class LoggerMiddleware {
    logToConsole(request, response, next) {
        console.log("Method: ", request.method);
        console.log("Route: ", request.originalUrl);
        console.log("Body: ", request.body);
        console.log("---------------------------------");
        next();
    }
}
exports.loggerMiddleware = new LoggerMiddleware();
