declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    ACCESS_TOKEN_SECRET: string;
    PORT: string;
    CORS_ORIGIN: string;
  }
}