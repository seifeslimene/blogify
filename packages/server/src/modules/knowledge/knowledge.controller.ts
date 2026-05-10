import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { Knowledge } from './knowledge.entity';
import { KnowledgeService } from './knowledge.service';

@ApiTags('Knowledge')
@Controller('Knowledge')
@UseGuards(RolesGuard)
export class KnowledgeController {
  constructor(private readonly service: KnowledgeService) {}

  /**
   * Create Knowledge Base
   * @param data
   */
  @ApiResponse({ status: 200, description: 'Create Knowledge Base', type: [Knowledge] })
  @Post('/book')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  createBook(@Body() data) {
    return this.service.createKnowledgeBook(data);
  }

  /**
   * Create Knowledge Base Chapters
   * @param data
   */
  @ApiResponse({ status: 200, description: 'Create Knowledge Chapter', type: [Knowledge] })
  @Post('/chapter')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  createChapter(@Body() data) {
    return this.service.createKnowledgeChapter(data);
  }

  /**
   * Delete Article
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.service.deleteById(id);
  }

  /**
   * Update Knowledge
   * @param id
   * @param data
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateById(@Param('id') id, @Body() data) {
    return this.service.updateById(id, data);
  }

  /**
   * Get All Knowledge Bases (Excluding Chapters)
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() queryParams) {
    return this.service.findAll(queryParams);
  }

  /**
   * Get Chapter Details (If It Is A Knowledge Base, The Included Chapters Will Be Returned)
   * @param id
   */
  @Get(':id')
  async findById(@Param('id') id) {
    return this.service.findById(id);
  }

  /**
   * Article Views +1
   */
  @Post(':id/views')
  @HttpCode(HttpStatus.OK)
  updateViewsById(@Param('id') id) {
    return this.service.updateViewsById(id);
  }

  /**
   * Article Likes +1
   */
  @Post(':id/likes')
  @HttpCode(HttpStatus.OK)
  updateLikesById(@Param('id') id, @Body('type') type) {
    return this.service.updateLikesById(id, type);
  }
}
