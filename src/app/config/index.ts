import donenv from 'dotenv';
import path from 'path';
donenv.config({ path: path.join(process.cwd(), '.env') });
export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
  NODE_ENV: process.env.NODE_ENV,
  jwt_access_secret: process.env.  JWT_ACCESS_SECRET,
  expires_in:  process.env.EXPIRES_IN,
  jwt_refresh_secret:process.env.JWT_REFRESH_SECRET,
  refresh_expires_in:process.env.REFRESH_EXPIRES_IN

};
