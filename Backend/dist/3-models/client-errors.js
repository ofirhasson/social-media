import { StatusCode } from "./enums";
class ClientError {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}
export class RouteNotFoundError extends ClientError {
    constructor(route) {
        super(`Route ${route} not found.`, StatusCode.NotFound);
    }
}
export class ResourceNotFoundError extends ClientError {
    constructor(_id) {
        super(`id ${_id} not exist.`, StatusCode.NotFound);
    }
}
export class ValidationError extends ClientError {
    constructor(message) {
        super(message, StatusCode.BadRequest);
    }
}
export class UnauthorizedError extends ClientError {
    constructor(message) {
        super(message, StatusCode.Unauthorized);
    }
}
