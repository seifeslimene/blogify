import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  /**
   * Add Category
   * @param Category
   */
  async create(Category: Partial<Category>): Promise<Category> {
    const { label } = Category;
    const existCategory = await this.categoryRepository.findOne({
      where: { label },
    });

    if (existCategory) {
      throw new HttpException('Category already exists', HttpStatus.BAD_REQUEST);
    }

    const newCategory = await this.categoryRepository.create(Category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  /**
   * Get All Categories
   */
  async findAll(queryParams): Promise<Category[]> {
    const { articleStatus } = queryParams;
    const qb = this.categoryRepository.createQueryBuilder('category').orderBy('category.createAt', 'ASC');

    if (articleStatus) {
      qb.leftJoinAndSelect('category.articles', 'articles', 'articles.status=:status', {
        status: articleStatus,
      });
    } else {
      qb.leftJoinAndSelect('category.articles', 'articles');
    }

    const data = await qb.getMany();

    data.forEach((d) => {
      Object.assign(d, { articleCount: d.articles.length });
      delete d.articles;
    });

    return data;

    // return this.categoryRepository.find({ order: { createAt: 'ASC' } });
  }

  /**
   * Get The Specified Category
   * @param id
   */
  async findById(id): Promise<Category> {
    const data = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id=:id')
      .orWhere('category.label=:id')
      .orWhere('category.value=:id')
      .setParameter('id', id)
      .getOne();

    return data;
  }

  async findByIds(ids): Promise<Array<Category>> {
    return this.categoryRepository.findByIds(ids);
  }

  /**
   * Update Category
   * @param id
   * @param Category
   */
  async updateById(id, category: Partial<Category>): Promise<Category> {
    const oldCategory = await this.categoryRepository.findOne(id);
    const updatedCategory = await this.categoryRepository.merge(oldCategory, category);
    return this.categoryRepository.save(updatedCategory);
  }

  /**
   * Delete Category
   * @param id
   */
  async deleteById(id) {
    try {
      const category = await this.categoryRepository.findOne(id);
      await this.categoryRepository.remove(category);
      return true;
    } catch (e) {
      throw new HttpException('Deletion Failed, There May Be Related Articles', HttpStatus.BAD_REQUEST);
    }
  }
}
