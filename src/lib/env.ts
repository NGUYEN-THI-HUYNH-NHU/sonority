import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    APP_URL: z.string().min(1),
    MINIO_ENDPOINT: z.string().min(1),
    MINIO_ACCESS_KEY_ID: z.string().min(1),
    MINIO_SECRET_ACCESS_KEY: z.string().min(1),
    MINIO_BUCKET_NAME: z.string().min(1),
    CHATTERBOX_API_URL: z.string(),
    CHATTERBOX_API_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
