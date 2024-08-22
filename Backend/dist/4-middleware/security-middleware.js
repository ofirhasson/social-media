import { cyber } from "../2-utils/cyber";
import { UnauthorizedError } from "../3-models/client-errors";
class SecurityMiddleware {
    verifyLoggedIn(request, response, next) {
        const authorizationHeader = request.header("authorization");
        const token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.substring(7);
        if (!cyber.isTokenValid(token)) {
            const err = new UnauthorizedError("You are not logged in.");
            next(err);
        }
        else {
            next();
        }
    }
    verifyAdmin(request, response, next) {
        const authorizationHeader = request.header("authorization");
        const token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.substring(7);
        if (!cyber.isAdmin(token)) {
            const err = new UnauthorizedError("You are not authorized.");
            next(err);
        }
        else {
            next();
        }
    }
}
export const securityMiddleware = new SecurityMiddleware();
