import { mockAccessTokenSecret } from './../mock_env';
import { JwtUserPayload } from './../../types/types';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: mockAccessTokenSecret,
    });
  }

  async validate(payload: any): Promise<JwtUserPayload> {
    return { userId: payload.sub, username: payload.username };
  }
}
