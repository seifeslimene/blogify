import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SMTP {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'text', default: null })
  from: string; // Sender

  @ApiProperty()
  @Column({ type: 'text', default: null })
  to: string; // Recipient

  @ApiProperty()
  @Column({ type: 'text', default: null })
  subject: string; // Subject

  @ApiProperty()
  @Column({ type: 'text', default: null })
  text: string; // Text Content

  @ApiProperty()
  @Column({ type: 'text', default: null })
  html: string; // Html Content

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: 'Creation time',
    name: 'create_at',
  })
  createAt: Date;
}
