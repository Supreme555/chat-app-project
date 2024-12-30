import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(@GetUser() currentUser: User) {
    console.log('Current user:', currentUser);
    const users = await this.usersService.findAll();
    console.log('All users:', users);
    return users.filter(user => user.id !== currentUser.id);
  }

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
} 