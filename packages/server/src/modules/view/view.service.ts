import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { parseIp } from '../../utils/ip.util';
import { parseUserAgent } from '../../utils/ua.util';
import { View } from './view.entity';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>
  ) {}

  /**
   * Add Access
   * @param tag
   */
  async create(ip: string, userAgent: string, url: string): Promise<View> {
    const exist = await this.viewRepository.findOne({
      where: { ip, userAgent, url },
    });
    const address = parseIp(ip);
    console.log(JSON.stringify(userAgent, null, 2));
    if (exist) {
      const count = exist.count;
      const newData = await this.viewRepository.merge(exist, {
        count: count + 1,
        // Refresh address so existing rows benefit from IP parsing fixes.
        address: address || exist.address,
      });
      await this.viewRepository.save(newData);
      return newData;
    }
    const { data: uaInfo } = parseUserAgent(userAgent);
    console.log(JSON.stringify(uaInfo, null, 2));
    const newData = await this.viewRepository.create({ ip, userAgent, url, address, ...uaInfo });
    // console.log(JSON.stringify(newData, null, 2));
    await this.viewRepository.save(newData);
    return newData;
  }

  /**
   * Get All Access
   */
  async findAll(queryParams): Promise<[View[], number]> {
    const query = this.viewRepository.createQueryBuilder('view').orderBy('view.createAt', 'DESC');
    if (typeof queryParams === 'object') {
      const { page = 1, pageSize = 12, ...otherParams } = queryParams;
      query.skip((+page - 1) * +pageSize);
      query.take(+pageSize);

      if (otherParams) {
        Object.keys(otherParams).forEach((key) => {
          query.andWhere(`view.${key} LIKE :${key}`).setParameter(`${key}`, `%${otherParams[key]}%`);
        });
      }
    }

    return query.getManyAndCount();
  }

  /**
   * Find Access Statistics For The Specified Path
   * @param url
   */
  async findByUrl(url): Promise<View[]> {
    return this.viewRepository.find({
      where: { url },
      order: { updateAt: 'ASC' },
    });
  }

  /**
   * Get Specified Access
   * @param id
   */
  async findById(id): Promise<View> {
    return this.viewRepository.findOne(id);
  }

  /**
   * Delete Visits
   * @param id
   */
  async deleteById(id) {
    const data = await this.viewRepository.findOne(id);
    return this.viewRepository.remove(data);
  }
}
