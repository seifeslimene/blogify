import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Page {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: null })
  cover: string; // Page Cover

  @ApiProperty()
  @Column()
  name: string; // Page Name

  @ApiProperty()
  @Column()
  path: string; // Page Path

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  order: number; // Order

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
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string; // Page Status

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishAt: Date; // Publish Date

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  views: number; // Reading Volume

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
