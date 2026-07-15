import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { IReviewWriteRepository } from '../../../domain/repositories/review-write.repository.interface';
import { Review } from '../../../domain/models/review.model';
import { ReviewDocument } from './review.document';
import { ReviewMapper } from '../../../application/mappers/review.mapper';

@Injectable()
export class MongoReviewWriteRepository implements IReviewWriteRepository {
  constructor(
    @InjectModel(ReviewDocument.name)
    private readonly mongoModel: Model<ReviewDocument>,
  ) {}

  // Match the interface signature using 'context'
  async save(review: Review, context?: any): Promise<void> {
    const persistenceModel = ReviewMapper.toPersistence(review);
    const session = context as ClientSession; // Cast it locally here

    await this.mongoModel.updateOne(
      { _id: persistenceModel._id },
      { $set: persistenceModel },
      { upsert: true, session },
    );
  }

  async findById(id: string, context?: any): Promise<Review | null> {
    const session = context as ClientSession;
    const doc = await this.mongoModel.findById(id).session(session || null).exec();
    return doc ? ReviewMapper.toDomain(doc) : null;
  }

  async delete(id: string, context?: any): Promise<void> {
    const session = context as ClientSession;
    await this.mongoModel.deleteOne({ _id: id }).session(session || null).exec();
  }
}