import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  /**
   * Check Whether The Password Is Consistent
   * @param password0 Password Before Encryption
   * @param password1 Encrypted Password
   */
  static comparePassword(password0, password1) {
    return bcrypt.compareSync(password0, password1);
  }

  static encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ length: 500 })
  name: string;

  @ApiProperty()
  @Exclude()
  @Column({ length: 500 })
  password: string;

  @ApiProperty()
  @Column({ length: 500, default: null })
  avatar: string; // Avatar

  @ApiProperty({ description: 'The Email Of The User' })
  @Column({ length: 500, default: null })
  email: string; // Email

  @ApiProperty()
  @Column('simple-enum', { enum: ['admin', 'visitor'], default: 'visitor' })
  role: string; // user Role

  @ApiProperty()
  @Column('simple-enum', { enum: ['locked', 'active'], default: 'active' })
  status: string; // User Status

  @ApiProperty()
  @Column({ default: 'normal' })
  type: string; // User Type

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: 'creation time',
    name: 'create_at',
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'datetime',
    comment: 'Update time',
    name: 'update_at',
  })
  updateAt: Date;

  /**
   * Encrypt Password Before Inserting Data
   */
  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
