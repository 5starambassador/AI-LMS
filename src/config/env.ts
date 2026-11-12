import * as dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val || val.trim() === '') {
    throw new Error(
      `[STARTUP ERROR] Missing required environment variable: ${key}\n` +
      `Copy .env.example to .env and set a strong value for ${key}.\n` +
      `Generate one with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
    );
  }
  return val.trim();
}

function optionalEnv(key: string, fallback = ''): string {
  return process.env[key]?.trim() || fallback;
}

export const ENV = {
  PORT: parseInt(optionalEnv('PORT', '4000'), 10),
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),

  JWT_SECRET:      requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN:  optionalEnv('JWT_EXPIRES_IN', '24h'),
  SSO_HMAC_SECRET: requireEnv('SSO_HMAC_SECRET'),

  CLOUD_VISION_API_KEY: optionalEnv('CLOUD_VISION_API_KEY'),
  WHISPER_API_KEY:      optionalEnv('WHISPER_API_KEY') || optionalEnv('OPENAI_API_KEY'),
  GEMINI_API_KEY:       optionalEnv('GEMINI_API_KEY'),

  ALLOWED_ORIGINS: [
    'https://one.achariya.in',
    'https://learning.achariya.in',
    'https://voice.achariya.in',
    'https://score.achariya.in',
    'https://admin.achariya.in',
    ...(optionalEnv('NODE_ENV', 'development') === 'development'
      ? ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:5173']
      : [])
  ]
} as const;
