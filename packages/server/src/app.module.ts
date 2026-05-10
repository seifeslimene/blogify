import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
//Configuration file
import { file as envFilePath } from '@blogify/config';

import { Article } from './modules/article/article.entity';
// Article module
import { ArticleModule } from './modules/article/article.module';
// Authentication module
import { AuthModule } from './modules/auth/auth.module';
import { Category } from './modules/category/category.entity';
// Classification module
import { CategoryModule } from './modules/category/category.module';
import { Comment } from './modules/comment/comment.entity';
//Comment module
import { CommentModule } from './modules/comment/comment.module';
import { File } from './modules/file/file.entity';
// file module
import { FileModule } from './modules/file/file.module';
import { Knowledge } from './modules/knowledge/knowledge.entity';
//Knowledge base module
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { Page } from './modules/page/page.entity';
//Page module
import { PageModule } from './modules/page/page.module';
//Search module
import { Search } from './modules/search/search.entity';
import { SearchModule } from './modules/search/search.module';
import { Setting } from './modules/setting/setting.entity';
// system module
import { SettingModule } from './modules/setting/setting.module';
import { SMTP } from './modules/smtp/smtp.entity';
//mail module
import { SMTPModule } from './modules/smtp/smtp.module';
import { Tag } from './modules/tag/tag.entity';
// label module
import { TagModule } from './modules/tag/tag.module';
import { User } from './modules/user/user.entity';
//User module
import { UserModule } from './modules/user/user.module';
import { View } from './modules/view/view.entity';
//Access statistics module
import { ViewModule } from './modules/view/view.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [envFilePath] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        entities: [User, File, Knowledge, Article, Category, Tag, Comment, Setting, SMTP, Page, View, Search],
        host: configService.get('DB_HOST', '0.0.0.0'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USER', 'houssem'),
        password: configService.get('DB_PASSWD', 'root'),
        database: configService.get('DB_DATABASE', 'blogify'),
        charset: 'utf8mb4',
        timezone: '+08:00',
        synchronize: true,
      }),
    }),
    UserModule,
    FileModule,
    TagModule,
    ArticleModule,
    KnowledgeModule,
    CategoryModule,
    CommentModule,
    SettingModule,
    SMTPModule,
    AuthModule,
    PageModule,
    ViewModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
