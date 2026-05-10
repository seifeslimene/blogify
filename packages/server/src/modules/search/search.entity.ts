import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Search {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  type: string; // Search Type

  @ApiProperty()
  @Column()
  keyword: string; // Search Keywords

  @ApiProperty()
  @Column({ default: 1 })
  count: number;

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
