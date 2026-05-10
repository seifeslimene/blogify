import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @ApiResponse({ status: 200, description: 'Get User List', type: [User] })
  @ApiResponse({ status: 403, description: 'Not Authorized To Obtain User List' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  /**
   * User Registration
   * @param user
   */
  @ApiResponse({ status: 201, description: 'Create User', type: [User] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'A User To Be Created',
    schema: {
      type: 'object',
      example: {
        name: 'Seif Eddine Slimene',
        password: '123456789',
        confirm: '123456789',
      },
    },
  })
  async register(@Body() user: Partial<User>): Promise<User> {
    const d = await this.userService.createUser(user);
    return d;
  }

  async checkPermission(req, user) {
    let token = req.headers.authorization;

    if (!token) {
      throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);
    }

    if (/Bearer/.test(token)) {
      // No Bearer Is Required, Otherwise Verification Fails
      token = token.split(' ').pop();
    }
    const tokenUser = this.jwtService.decode(token) as User;
    const id = tokenUser.id;

    if (!id) {
      throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);
    }

    const exist = await this.userService.findById(id);
    if (exist.id !== user.id && exist.role !== 'admin') {
      throw new HttpException('Not Authorized To Process', HttpStatus.FORBIDDEN);
    }

    req.user = tokenUser;
  }

  /**
   * User Update
   * @param user
   */
  @ApiResponse({ status: 200, description: 'Update User Successfully', type: [User] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('update')
  @HttpCode(HttpStatus.CREATED)
  async update(@Request() req, @Body() user: Partial<User>): Promise<User> {
    await this.checkPermission(req, user);
    const d = await this.userService.updateById(req.user, user.id, user);
    return d;
  }

  /**
   * Update User Password
   * @param user
   */
  @ApiResponse({ status: 201, description: 'Password Updated Successfully', type: [User] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('password')
  @HttpCode(HttpStatus.CREATED)
  async updatePassword(@Request() req, @Body() user: Partial<User>): Promise<User> {
    await this.checkPermission(req, user);
    const d = await this.userService.updatePassword(user.id, user);
    return d;
  }
}
