import multer from "multer"
import path from "path"
import fs from "fs"

import { ALLOWED_FILE_MIMETYPES, MAX_FILE_SIZE_BYTES } from "../utils/constants.js"
import logger from "./logger.js"

const UPLOADS_ROOT = path.resolve("uploads")

function buildStorage(subfolder) {
    const destination = path.join(UPLOADS_ROOT, subfolder)
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true })
    }
    return multer.diskStorage({
        destination: (req, file, cb) => cb(null, destination),
        filename: (req, file, cb) => {
            const sanitizedOriginalName = file.originalname.replace(/\s+/g, "_")
            cb(null, `${Date.now()}-${sanitizedOriginalName}`)
        }
    })
}

function fileFilter(req, file, cb) {
    if (!ALLOWED_FILE_MIMETYPES.includes(file.mimetype)) {
        logger.warn(`Rejected upload attempt: "${file.originalname}" (${file.mimetype}) — type not allowed`)
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'INVALID_FILE_TYPE'))
    }
    cb(null, true)
}

export function createUploader(subfolder) {
    return multer({
        storage: buildStorage(subfolder),
        fileFilter,
        limits: { fileSize: MAX_FILE_SIZE_BYTES }
    })
}