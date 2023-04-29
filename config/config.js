import dotenv from 'dotenv'
dotenv.config()

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8800,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    mongoUri: process.env.MONGO_URI || "failed",
    backend_host: process.env.BACKEND_HOST || 'http://localhost:8800',
    frontend_host: process.env.FRONTEND_HOST || 'http://localhost:3000'
}

export default config