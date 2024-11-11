import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV = 'development', PORT, SECRET_KEY = 'secret', LOG_FORMAT = 'dev', LOG_DIR = '../../logs', ORIGIN = '*' } = process.env;
export const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST = 'localhost', POSTGRES_PORT = '5432', POSTGRES_DATABASE } = process.env;
export const { ADMIN_USER = 'Admin_user1', ADMIN_PASSWORD = 'Admin_password1' } = process.env;
