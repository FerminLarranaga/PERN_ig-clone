import { Pool } from "pg";
import { config } from "dotenv";
config();

// const pool = new Pool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT!),
//     database: process.env.DB_DATABASE
// });

const devConfig = {
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
}

const proConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const pool = new Pool(process.env.NODE_ENV === 'production'? proConfig : devConfig);

export default pool;