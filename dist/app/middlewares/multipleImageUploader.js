"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleImageUploader = void 0;
const fileUploader_1 = require("../../helpers/fileUploader");
const multipleImageUploader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const uploadedImages = yield fileUploader_1.fileUploader.uploadMultipleToCloudinary(files);
        // Add uploaded image URLs to the request body
        req.body.images = uploadedImages.map((img) => img.secure_url);
        next();
    }
    catch (error) {
        next(error); // Pass error to the error-handling middleware
    }
});
exports.multipleImageUploader = multipleImageUploader;
