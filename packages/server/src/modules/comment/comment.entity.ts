import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  email: string; // Contact Information

  @ApiProperty()
  @Column()
  avatar: string;

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' }) // Comment Content
  content: string;

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' }) // Comment Content
  html: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  pass: boolean; // Whether The Review Is Passed

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  userAgent: string;

  @ApiProperty()
  @Column()
  hostId: string; // Associated Article Or Page ID

  @ApiProperty()
  @Column()
  url: string; // Associated Page Path, Can Be Spliced With SystemUrl

  @ApiProperty()
  @Column({ default: null })
  parentCommentId: string; // Parent Comment ID

  @ApiProperty()
  @Column({ default: null })
  replyUserName: string; // Reply Comment User Name

  @ApiProperty()
  @Column({ default: null })
  replyUserEmail: string; // Reply To Comment Email

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
