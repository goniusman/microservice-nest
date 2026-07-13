import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ReviewDocument,
  ReviewSchema,
} from '../schemas/review.schema';

import {
  ReviewRepository,
} from '../../../domain/repositories/review.repository';

import { Review } from '../../../domain/entities/review.entity';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class MongoReviewRepository
  implements ReviewRepository
{
  constructor(
    @InjectModel(ReviewSchema.name)
    private readonly model: Model<ReviewDocument>,
  ) {}

  async save(review: Review): Promise<void> {
    await this.model.create(
      ReviewMapper.toPersistence(review),
    );
  }

  async findById(
    id: string,
  ): Promise<Review | null> {
    const document = await this.model.findOne({
      id,
    });

    if (!document) {
      return null;
    }

    return ReviewMapper.toDomain(document);
  }

  async findByUserAndBook(
    userId: string,
    bookId: string,
  ): Promise<Review | null> {
    const document = await this.model.findOne({
      userId,
      bookId,
    });

    if (!document) {
      return null;
    }

    return ReviewMapper.toDomain(document);
  }

  async update(
    review: Review,
  ): Promise<void> {
    await this.model.updateOne(
      {
        id: review.properties.id,
      },
      ReviewMapper.toPersistence(review),
    );
  }

  async delete(
    id: string,
  ): Promise<void> {
    await this.model.deleteOne({
      id,
    });
  }
}