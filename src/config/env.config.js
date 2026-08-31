import dotenv from "dotenv"

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
dotenv.config({ path: envFile })


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
}