import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export type JwtUserPayload = {
  userId: string;
  username: string;
} & JwtPayload;

export type MyRequest = Request & {
  user: JwtUserPayload;
};
