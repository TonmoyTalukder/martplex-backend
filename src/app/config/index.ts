import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  cloudinary: {
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_secret: process.env.CLOUDINARY_SECRET,
  },
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_password_token: process.env.RESET_PASSWORD_TOKEN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  frontend_url: process.env.FRONTEND_URL,
  emailSender: {
    email: process.env.SENDER_EMAIL,
    app_pass: process.env.SENDER_APP_PASS,
  },
  payment: {
    baseURL: process.env.PAYMENT_URL,
    storeID: process.env.STORE_ID,
    signatureKey: process.env.SIGNATURE_KEY,
    paymentVerifyURL: process.env.PAYMENT_VERIFY_URL,
  },
};
