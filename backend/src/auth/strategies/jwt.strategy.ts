import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-12345',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    try {
      console.log('JWT Strategy - Starting validation');
      console.log('JWT Payload:', payload);
      console.log('Secret key:', process.env.JWT_SECRET);
      console.log('Request headers:', request.headers);
      
      if (!payload.id) {
        console.log('No user ID in payload');
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.usersService.findById(payload.id);
      console.log('Found user:', user);
      
      if (!user) {
        console.log('User not found');
        throw new UnauthorizedException('User not found');
      }

      console.log('Validation successful');
      return user;
    } catch (error) {
      console.error('JWT validation error:', error);
      throw error;
    }
  }
} 