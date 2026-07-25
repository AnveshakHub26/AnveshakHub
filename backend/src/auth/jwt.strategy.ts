import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret') || 'anveshakhub-super-secret-jwt-key-2026',
    });
  }

  async validate(payload: any) {
    if (!payload || (!payload.sub && !payload.id && !payload.email)) {
      throw new UnauthorizedException('Invalid JWT token payload');
    }

    const email = payload.email;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        id: payload.sub || payload.id,
        email: payload.email,
        role: payload.role || payload.user_metadata?.role || 'USER',
      };
    }

    return user;
  }
}
