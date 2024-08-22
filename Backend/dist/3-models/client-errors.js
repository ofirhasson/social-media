"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.ValidationError = exports.ResourceNotFoundError = exports.RouteNotFoundError = void 0;
const enums_1 = require("./enums");
class ClientError {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}
class RouteNotFoundError extends ClientError {
    constructor(route) {
        super(`Route ${route} not found.`, enums_1.StatusCode.NotFound);
    }
}
exports.RouteNotFoundError = RouteNotFoundError;
class ResourceNotFoundError extends ClientError {
    constructor(_id) {
        super(`id ${_id} not exist.`, enums_1.StatusCode.NotFound);
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
class ValidationError extends ClientError {
    constructor(message) {
        super(message, enums_1.StatusCode.BadRequest);
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends ClientError {
    constructor(message) {
        super(message, enums_1.StatusCode.Unauthorized);
    }
}
exports.UnauthorizedError = UnauthorizedError;
