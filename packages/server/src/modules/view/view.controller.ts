import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { getClientIP } from '../../utils/ip.util';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { View } from './view.entity';
import { ViewService } from './view.service';

@ApiTags('View')
@Controller('view')
@UseGuards(RolesGuard)
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  /**
   * Add Access
   * @param tag
   */
  @ApiResponse({ status: 200, description: 'Access Record Added Successfully', type: [View] })
  @Post()
  create(@Request() req, @Body() data) {
    const userAgent = req.headers['user-agent'];
    const url = data.url;
    return this.viewService.create(getClientIP(req), userAgent, url);
  }

  /**
   * Get All Access
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() queryParam) {
    return this.viewService.findAll(queryParam);
  }

  /**
   * Get Specified Access
   * @param id
   */
  @Get('/url')
  findByUrl(@Query('url') url) {
    return this.viewService.findByUrl(url);
  }

  /**
   * Get Specified Access
   * @param id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id) {
    return this.viewService.findById(id);
  }

  /**
   * Remove Access
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.viewService.deleteById(id);
  }
}
