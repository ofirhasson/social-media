var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import { appConfig } from "./2-utils/app-config";
import { dal } from "./2-utils/dal";
import { errorsMiddleware } from "./4-middleware/errors-middleware";
import { loggerMiddleware } from "./4-middleware/logger-middleware";
import { authRouter } from "./6-controllers/auth-contoller";
import { commentRouter } from "./6-controllers/comment-controller";
import { likeRouter } from "./6-controllers/like-controller";
import { postRouter } from "./6-controllers/post-controller";
import { repliesRouter } from "./6-controllers/replies-contoller";
import { usersRouter } from "./6-controllers/users-contoller";
import { socketService } from "./5-services/socket-service";
class App {
    constructor() {
        this.server = express();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.server.use(cors());
            this.server.use(express.json());
            this.server.use(expressFileUpload());
            this.server.use(loggerMiddleware.logToConsole);
            this.server.use("/api", usersRouter, authRouter, postRouter, likeRouter, commentRouter, repliesRouter);
            this.server.use(errorsMiddleware.routeNotFound);
            this.server.use(errorsMiddleware.catchAll);
            yield dal.connect();
            const httpServer = this.server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
            socketService.handleSocketMessages(httpServer);
        });
    }
}
const app = new App();
app.start();
