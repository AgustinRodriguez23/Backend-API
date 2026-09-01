import fs from "fs/promises"

export async function deleteFileIfExists(filePath) {
    try {
        await fs.unlink(filePath)
    } catch (error) {
    }
}