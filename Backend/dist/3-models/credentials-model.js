"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsModel = exports.CredentialsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CredentialsSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Missing email"],
        minlength: [7, "Email must be longer than 7 characters"],
        maxlength: [50, "Email should be shorter than 50 characters"],
    },
    password: {
        type: String,
        required: [true, "Missing password"],
        minlength: [6, "Password must be longer than 6 characters"],
    },
}, { autoCreate: false });
exports.CredentialsModel = (0, mongoose_1.model)("CredentialsModel", exports.CredentialsSchema);
