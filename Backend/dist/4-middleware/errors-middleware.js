import { StatusCode } from "../3-models/enums";
import { RouteNotFoundError } from "../3-models/client-errors";
import { logger } from "../2-utils/logger";
import { appConfig } from "../2-utils/app-config";
class ErrorsMiddleware {
    routeNotFound(request, response, next) {
        const err = new RouteNotFoundError(request.originalUrl);
        next(err);
    }
    catchAll(err, request, response, next) {
        console.log(err);
        logger.logError(err);
        const status = err.status || StatusCode.InternalServerError;
        const message = (status === StatusCode.InternalServerError && appConfig.isProduction) ? "Some error, please try again later." : err.message;
        response.status(status).send(message);
    }
}
export const errorsMiddleware = new ErrorsMiddleware();
