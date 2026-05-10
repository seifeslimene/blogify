import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Setting {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'text', default: null })
  i18n: string; // Internationalization

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemUrl: string; // System Address

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemTitle: string; // System Title

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemLogo: string; // System Logo

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemBg: string; // Global Background

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemFavicon: string; // System Favicon

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemFooterInfo: string; // System Footer

  @ApiProperty()
  @Column({ type: 'text', default: null })
  adminSystemUrl: string; //Backend System Address

  @ApiProperty()
  @Column({ type: 'text', default: null })
  googleAnalyticsId: string; // Google Analytics ID

  @ApiProperty()
  @Column({ type: 'text', default: null })
  seoKeyword: string; // SEO Keywords

  @ApiProperty()
  @Column({ type: 'text', default: null })
  seoDesc: string; // SEO Description

  @ApiProperty()
  @Column({ type: 'text', default: null })
  oss: string; // OSS Upload Configuration

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpHost: string; // SMTP Address

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpPort: string; // SMTP Port

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpUser: string; // SMTP User

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpPass: string; // SMTP Authorization Code

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpFromUser: string; // SMTP Sender
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
}
