var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { appConfig } from "./app-config";
class DAL {
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield mongoose.connect(appConfig.mongodbConnectionString);
                console.log(`We are connected MongoDB, database: ${db.connections[0].name}`);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
export const dal = new DAL();
