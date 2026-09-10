import { z } from 'zod';

const envSchema = z.object({
  MONGO_URI: z.url({ protocol: /mongodb/ }),
  DB_NAME: z.string().default('travel-journal'),
  PORT: z.int().default(8000),
  AUTH_BASE_URL: z.string().default('http://localhost:3000'),
  CLIENT_BASE_URL: z.string().default('http://localhost:5173'),
  ACCESS_JWT_SECRET: z
    .string({
      error: 'ACCESS_JWT_SECRET is required and must be at least 64 characters long'
    })
    .min(64)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:\n', z.prettifyError(parsedEnv.error));
  process.exit(1);
}

export const { DB_NAME, MONGO_URI, PORT, AUTH_BASE_URL, CLIENT_BASE_URL, ACCESS_JWT_SECRET } = parsedEnv.data;
