"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsMiddleware = void 0;
const enums_1 = require("../3-models/enums");
const client_errors_1 = require("../3-models/client-errors");
const logger_1 = require("../2-utils/logger");
const app_config_1 = require("../2-utils/app-config");
class ErrorsMiddleware {
    routeNotFound(request, response, next) {
        const err = new client_errors_1.RouteNotFoundError(request.originalUrl);
        next(err);
    }
    catchAll(err, request, response, next) {
        console.log(err);
        logger_1.logger.logError(err);
        const status = err.status || enums_1.StatusCode.InternalServerError;
        const message = (status === enums_1.StatusCode.InternalServerError && app_config_1.appConfig.isProduction) ? "Some error, please try again later." : err.message;
        response.status(status).send(message);
    }
}
exports.errorsMiddleware = new ErrorsMiddleware();
