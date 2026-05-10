import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  originalname: string; // Original Name

  @ApiProperty()
  @Column()
  filename: string; // Filename

  @ApiProperty()
  @Column()
  type: string; // File Type

  @ApiProperty()
  @Column()
  size: number; // File Size

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: 'Creation time',
    name: 'create_at',
  })
  createAt: Date;
}
