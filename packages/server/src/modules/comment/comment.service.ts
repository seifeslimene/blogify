import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { marked } from '../../utils/markdown.util';
import { parseUserAgent } from '../../utils/ua.util';
import { ArticleService } from '../article/article.service';
import { SettingService } from '../setting/setting.service';
import { SMTPService } from '../smtp/smtp.service';
import { UserService } from '../user/user.service';
import { Comment } from './comment.entity';
import { getNewCommentHTML, getReplyCommentHTML } from './html';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const url = require('url');

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly articleService: ArticleService,
    private readonly smtpService: SMTPService,
    private readonly settingService: SettingService,
    private readonly userService: UserService
  ) {}

  /**
   * Create A Comment
   * @param comment
   */
  async create(userAgent, comment: Partial<Comment> & { reply?: string; createByAdmin?: boolean }): Promise<Comment> {
    const { hostId, name, email, content, createByAdmin = false } = comment;

    if (!hostId || !name || !email || !content) {
      throw new HttpException('Missing Parameter', HttpStatus.BAD_REQUEST);
    }

    comment.pass = false;
    const { text: uaText } = parseUserAgent(userAgent);
    comment.userAgent = uaText;
    comment.html = marked(content).html;
    const newComment = await this.commentRepository.create(comment);
    await this.commentRepository.save(comment);

    if (!createByAdmin) {
      // Send Notification Email
      const setting = await this.settingService.findAll(true);
      const sendEmail = (adminName, adminEmail) => {
        const emailMessage = {
          from: setting.smtpFromUser,
          to: adminEmail,
          subject: 'New Comment Notification',
          html: getNewCommentHTML({ ...setting, adminName, comment }),
        };
        this.smtpService.create(emailMessage).catch(() => {
          console.log('New Comments Received, But Email Notification Failed');
        });
      };
      try {
        // Notify All Administrators To Review Comments
        const [users] = await this.userService.findAll({ role: 'admin' });
        users.forEach((user) => {
          if (user.email) {
            sendEmail(user.name, user.email);
          }
        });
      } catch (e) {
        console.log('Failed To Send Email Notification To Administrator');
      }
    }

    return newComment;
  }

  /**
   * Check All Comments
   * Add Additional Article Information
   */
  async findAll(queryParams): Promise<[Comment[], number]> {
    const query = this.commentRepository.createQueryBuilder('comment').orderBy('comment.createAt', 'DESC');

    if (typeof queryParams === 'object') {
      const { page = 1, pageSize = 12, pass, ...otherParams } = queryParams;

      query.skip((+page - 1) * +pageSize);
      query.take(+pageSize);

      if (pass) {
        query.andWhere('comment.pass=:pass').setParameter('pass', pass);
      }

      if (otherParams) {
        Object.keys(otherParams).forEach((key) => {
          query.andWhere(`comment.${key} LIKE :${key}`).setParameter(`${key}`, `%${otherParams[key]}%`);
        });
      }
    }

    return query.getManyAndCount();
  }

  /**
   * Get Specified Comments
   * @param id
   */
  async findById(id): Promise<Comment> {
    return this.commentRepository.findOne(id);
  }

  /**
   * Get Article Comments
   * @param articleId
   */
  async getArticleComments(hostId, queryParams) {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.hostId=:hostId')
      .andWhere('comment.pass=:pass')
      .andWhere('comment.parentCommentId is NULL')
      .orderBy('comment.createAt', 'DESC')
      .setParameter('hostId', hostId)
      .setParameter('pass', true);

    const subQuery = this.commentRepository
      .createQueryBuilder('comment')
      .andWhere('comment.pass=:pass')
      .andWhere('comment.parentCommentId=:parentCommentId')
      .orderBy('comment.createAt', 'ASC')
      .setParameter('pass', true);

    const { page = 1, pageSize = 12 } = queryParams;
    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);
    const [data, count] = await query.getManyAndCount();

    for (const item of data) {
      const subComments = await subQuery.setParameter('parentCommentId', item.id).getMany();
      Object.assign(item, { children: subComments });
    }

    return [data, count];
  }

  async findByIds(ids): Promise<Array<Comment>> {
    return this.commentRepository.findByIds(ids);
  }

  /**
   * Updated Comments
   * @param id
   * @param tag
   */
  async updateById(id, data: Partial<Comment>): Promise<Comment> {
    const old = await this.commentRepository.findOne(id);
    const newData = await this.commentRepository.merge(old, data);

    if (newData.pass) {
      const { replyUserName, replyUserEmail, url: link } = newData;
      const isReply = replyUserName && replyUserEmail;
      if (isReply) {
        // Send Notification Email
        try {
          const setting = await this.settingService.findAll(true);
          const emailMessage = {
            from: setting.smtpFromUser,
            to: replyUserEmail,
            subject: 'Comment reply notification',
            html: getReplyCommentHTML({
              ...setting,
              replyUserName,
              commentHostUrl: url.resolve(setting.systemUrl, link),
            }),
          };
          this.smtpService.create(emailMessage).catch(() => {
            console.log(`Notify user ${replyUserName}(${replyUserEmail}), but failed to send email notification`);
          });
        } catch (e) {} // eslint-disable-line no-empty
      }
    }

    return this.commentRepository.save(newData);
  }

  async deleteById(id) {
    const data = await this.commentRepository.findOne(id);
    return this.commentRepository.remove(data);
  }
}
