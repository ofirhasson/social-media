class LoggerMiddleware {
    logToConsole(request, response, next) {
        console.log("Method: ", request.method);
        console.log("Route: ", request.originalUrl);
        console.log("Body: ", request.body);
        console.log("---------------------------------");
        next();
    }
}
export const loggerMiddleware = new LoggerMiddleware();
