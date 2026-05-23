import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env")
});

const config = {
    port: process.env.PORT,
    connectionString: process.env.CONNECTION_STRING,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
}

export default config;