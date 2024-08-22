var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fsPromises from "fs/promises";
class Logger {
    constructor() {
        this.filePath = "errors.log";
    }
    logError(err) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const content = `Time: ${now}\nMessage: ${err.message}\nStack: ${err.stack}\n---------------------------------------\n\n`;
            fsPromises.appendFile(this.filePath, content);
        });
    }
}
export const logger = new Logger();
