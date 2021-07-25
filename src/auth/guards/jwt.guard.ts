import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../auth.decorator';
// import { TokenExpiredError, verify, sign } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  // private refreshAccessToken(refreshToken: string) {
  //   const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  //   console.log(payload);
  //   return sign(payload, process.env.ACCESS_TOKEN_SECRET);
  // }

  handleRequest(err, user, _info: Error) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
