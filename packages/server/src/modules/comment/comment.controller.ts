import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@ApiTags('Comment')
@Controller('comment')
@UseGuards(RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * Create A Comment
   * @param comment
   */
  @ApiResponse({ status: 200, description: 'Create A Comment', type: [Comment] })
  @Post()
  create(@Request() req, @Body() comment) {
    const userAgent = req.headers['user-agent'];
    return this.commentService.create(userAgent, comment);
  }

  /**
   * Get All Comments
   */
  @Get()
  findAll(@Query() queryParams) {
    return this.commentService.findAll(queryParams);
  }

  /**
   * Get Specified Comments
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.commentService.findById(id);
  }

  /**
   * Get Comments On An Article Or Page
   * @param hostId
   */
  @Get('host/:hostId')
  getArticleComments(@Param('hostId') hostId, @Query() qurey) {
    return this.commentService.getArticleComments(hostId, qurey);
  }

  /**
   * Update Comment
   * @param id
   * @param tag
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id, @Body() data) {
    return this.commentService.updateById(id, data);
  }

  /**
   * Delete Comment
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.commentService.deleteById(id);
  }
}
