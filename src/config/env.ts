import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'achariya-ai-one-enterprise-secret-key-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  SSO_HMAC_SECRET: process.env.SSO_HMAC_SECRET || 'achariya-sso-hmac-sha256-key-2026-unique',
  CLOUD_VISION_API_KEY: process.env.CLOUD_VISION_API_KEY || process.env.GOOGLE_VISION_KEY || '',
  WHISPER_API_KEY: process.env.WHISPER_API_KEY || process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  ALLOWED_ORIGINS: [
    'https://one.achariya.in',
    'https://learning.achariya.in',
    'https://voice.achariya.in',
    'https://score.achariya.in',
    'https://admin.achariya.in',
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:5173'
  ]
};
