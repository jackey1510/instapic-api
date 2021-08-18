export const cookieId = 'jid';
export const accessTokenExpireTime = '15m';
export const refreshTokenExpireTime = '30d';
export const maxPostPerRequest = 50;
export const __prod__ = process.env.NODE_ENV === 'production';
export const gcp_storage_url = 'https://storage.googleapis.com';
export const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
