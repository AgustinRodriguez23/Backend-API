import { createUploader } from "../config/multer.js"
import CustomError from "../errors/custom.error.js"

const uploadUserDocument = createUploader("users").single("document")
const uploadDeliveryReceipt = createUploader("delivery-receipts").single("receipt")

function wrapUpload(uploaderMiddleware) {
    return (req, res, next) => {
        uploaderMiddleware(req, res, (err) => {
            if (err) return next(err)
            if (!req.file) return next(new CustomError('FILE_REQUIRED'))
            next()
        })
    }
}

export const handleUserDocumentUpload = wrapUpload(uploadUserDocument)
export const handleDeliveryReceiptUpload = wrapUpload(uploadDeliveryReceipt)