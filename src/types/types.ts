import { Request } from 'express';

export type JwtUserPayload = {
  userId: string;
  username: string;
};

export type MyRequest = Request & {
  user: JwtUserPayload;
};
