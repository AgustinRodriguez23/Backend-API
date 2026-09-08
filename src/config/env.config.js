import dotenv from "dotenv"

const ENV_FILES = {
    test: '.env.test',
    production: '.env.production',
}
const envFile = ENV_FILES[process.env.NODE_ENV] ?? '.env'
dotenv.config({ path: envFile, override: true })

const REQUIRED_ENV_VARS = ['PORT', 'NODE_ENV', 'MONGODB_URI']

for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
        throw new Error(`Missing required enviroment variable: ${varName}`)
    }
}

export const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
}