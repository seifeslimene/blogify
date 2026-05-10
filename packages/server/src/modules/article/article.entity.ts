import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from '../category/category.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ default: null })
  cover: string; // Cover Image

  @ApiProperty()
  @Column({ type: 'text', default: null })
  summary: string; // Summary, Automatically Generated

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  content: string; // Original Content

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  html: string; // Formatted Content, Automatically Generated

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null })
  toc: string; // Formatted Content Index, Automatically Generated

  @ApiProperty()
  @ManyToOne(
    () => Category,
    (category) => category.articles,
    { cascade: true }
  )
  @JoinTable()
  category: Category;

  @ApiProperty()
  @ManyToMany(
    () => Tag,
    (tag) => tag.articles,
    { cascade: true }
  )
  @JoinTable()
  tags: Array<Tag>;

  @ApiProperty()
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string; // Article Status

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  views: number; // Reading Volume

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  likes: number; // Number Of Likes

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isRecommended: boolean; // Whether To Recommend To The Homepage

  @ApiProperty()
  @Column({ type: 'text', default: null, select: false })
  password: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  needPassword: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isCommentable: boolean;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishAt: Date; // Publish Date

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: 'Creation time',
    name: 'create_at',
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'datetime',
    comment: 'update time',
    name: 'update_at',
  })
  updateAt: Date;
}
