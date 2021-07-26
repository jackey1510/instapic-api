declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    PORT: string;
    COOKIE_SECRET: string;
    CORS_ORIGIN: string;
    BUCKET_NAME: string;
    GOOGLE_APPLICATION_CREDENTIALS: string;
  }
}