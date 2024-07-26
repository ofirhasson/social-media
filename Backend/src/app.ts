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

// Main application class:
class App {
  // Express server:
  private server = express();

  // Start app:
  public async start(): Promise<void> {
    // Enable CORS requests:
    this.server.use(cors()); // Enable CORS for any frontend website.

    // Create a request.body containing the given json from the front:
    this.server.use(express.json());

    // Create request.files containing uploaded files:
    this.server.use(expressFileUpload());

    // Configure images folder:
    // fileSaver.config(path.join(__dirname, "1-assets", "images"));


    // Register middleware:
    this.server.use(loggerMiddleware.logToConsole);

    // Connect any controller route to the server:
    this.server.use("/api", usersRouter, authRouter, postRouter, likeRouter, commentRouter, repliesRouter);

    // Route not found middleware:
    this.server.use(errorsMiddleware.routeNotFound);

    // Catch all middleware:
    this.server.use(errorsMiddleware.catchAll);

    // connect to MongoDB
    await dal.connect();

    // run server
   const httpServer = this.server.listen(appConfig.port, () =>
      console.log("Listening on http://localhost:" + appConfig.port)
    );

    socketService.handleSocketMessages(httpServer)
  }
}

const app = new App();
app.start();
