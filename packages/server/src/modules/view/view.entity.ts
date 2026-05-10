import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class View {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  ip: string;

  @ApiProperty()
  @Column({ type: 'text', default: null })
  userAgent: string;

  @ApiProperty()
  @Column({ type: 'text', default: null })
  url: string;

  @ApiProperty()
  @Column({ default: 1 })
  count: number; // Number Of Visits To The Same User Agent And The Same Url

  @ApiProperty()
  @Column({ type: 'text', default: null })
  address: string; // Access Address

  @ApiProperty()
  @Column({ type: 'text', default: null })
  browser: string; // Access Browser

  @ApiProperty()
  @Column({ type: 'text', default: null })
  engine: string; // Accessed Browser Kernel

  @ApiProperty()
  @Column({ type: 'text', default: null })
  os: string; // Access Operating System

  @ApiProperty()
  @Column({ type: 'text', default: null })
  device: string; // Access Device

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
