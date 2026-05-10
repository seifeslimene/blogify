import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';

@ApiTags('Tag')
@Controller('tag')
@UseGuards(RolesGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * Add Tag
   * @param tag
   */
  @ApiResponse({ status: 200, description: 'Create Tag', type: [Tag] })
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  create(@Body() tag) {
    return this.tagService.create(tag);
  }

  /**
   * Get All Tags
   */
  @Get()
  findAll(@Query() queryParams): Promise<Tag[]> {
    return this.tagService.findAll(queryParams);
  }

  /**
   * Get The Specified Tag
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.tagService.findById(id);
  }

  /**
   * Get The Specified Tag, Including Related Article Information
   * @param id
   */
  @Get(':id/article')
  getArticleById(@Param('id') id, @Query('status') status) {
    return this.tagService.getArticleById(id, status);
  }

  /**
   * Update Tags
   * @param id
   * @param tag
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id, @Body() tag) {
    return this.tagService.updateById(id, tag);
  }

  /**
   * Delete Tag
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.tagService.deleteById(id);
  }
}
