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
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { User } from '../user/user.entity';
import { Article } from './article.entity';
import { UserService } from '../user/user.service';
import { ArticleService } from './article.service';

@ApiTags('Article')
@Controller('article')
@UseGuards(RolesGuard)
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,

    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  /**
   * Create Article
   * @param article
   */
  @ApiResponse({ status: 200, description: 'Create Article', type: [Article] })
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  create(@Body() article) {
    return this.articleService.create(article);
  }

  /**
   * Get All Articles
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() queryParams) {
    return this.articleService.findAll(queryParams);
  }

  /**
   * Get All Articles Under The Tag
   */
  @Get('/category/:id')
  @HttpCode(HttpStatus.OK)
  findArticlesByCategory(@Param('id') category, @Query() queryParams) {
    return this.articleService.findArticlesByCategory(category, queryParams);
  }

  /**
   * Get All Articles Under The Tag
   */
  @Get('/tag/:id')
  @HttpCode(HttpStatus.OK)
  findArticlesByTag(@Param('id') tag, @Query() queryParams) {
    return this.articleService.findArticlesByTag(tag, queryParams);
  }

  /**
   * Get All Recommended Articles
   */
  @Get('/all/recommend')
  @HttpCode(HttpStatus.OK)
  getRecommendArticles() {
    return this.articleService.getRecommendArticles();
  }

  /**
   * Get All Article Archives
   */
  @Get('/archives')
  @HttpCode(HttpStatus.OK)
  getArchives(): Promise<{ [key: string]: Article[] }> {
    return this.articleService.getArchives();
  }

  /**
   * Get Recommended Articles For Corresponding Articles
   */
  @Get('/recommend')
  @HttpCode(HttpStatus.OK)
  recommend(@Query('articleId') articleId) {
    return this.articleService.recommend(articleId);
  }

  /**
   * Get The Specified Article
   * @param id
   */
  @Get(':id')
  async findById(@Request() req, @Param('id') id, @Query('status') status) {
    let token = req.headers.authorization;

    if (/Bearer/.test(token)) {
      // No Bearer Is Required, Otherwise Verification Fails
      token = token.split(' ').pop();
    }

    try {
      const tokenUser = this.jwtService.decode(token) as User;
      const userId = tokenUser.id;
      const exist = await this.userService.findById(userId);
      const isAdmin = userId && exist.role === 'admin';
      return this.articleService.findById(id, status, isAdmin);
    } catch (e) {
      return this.articleService.findById(id, status);
    }
  }

  /**
   * Verify Article Password
   * @param id
   * @param article
   */
  @Post(':id/checkPassword')
  @HttpCode(HttpStatus.OK)
  checkPassword(@Param('id') id, @Body() article) {
    return this.articleService.checkPassword(id, article);
  }

  /**
   * Article Views +1
   */
  @Post(':id/views')
  @HttpCode(HttpStatus.OK)
  updateViewsById(@Param('id') id) {
    return this.articleService.updateViewsById(id);
  }

  /**
   * Article Likes +1
   */
  @Post(':id/likes')
  @HttpCode(HttpStatus.OK)
  updateLikesById(@Param('id') id, @Body('type') type) {
    return this.articleService.updateLikesById(id, type);
  }

  /**
   * Update Article
   * @param id
   * @param article
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateById(@Param('id') id, @Body() article) {
    return this.articleService.updateById(id, article);
  }

  /**
   * Delete Article
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.articleService.deleteById(id);
  }
}
