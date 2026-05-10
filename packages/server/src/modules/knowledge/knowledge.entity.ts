import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Knowledge {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: null })
  parentId: string; // Parent Id. If This Item Is Empty, It Is The Cover Of The Book. If It Is Not Empty, It Is A Chapter.

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  order: number; // Chapter Sorting

  @ApiProperty()
  @Column()
  title: string; // Title

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
  @Column('simple-enum', { enum: ['draft', 'publish'], default: 'draft' })
  status: string; // Article Status

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  views: number; // Reading Volume

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  likes: number; // Number Of Likes

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
