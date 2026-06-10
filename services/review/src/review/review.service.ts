import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(dto: CreateReviewDto) {
    return this.reviewModel.create(dto);
  }

  async findAll() {
    return this.reviewModel.find();
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, dto: UpdateReviewDto) {
    const review = await this.reviewModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async delete(id: string) {
    const review = await this.reviewModel.findByIdAndDelete(id);
    if (!review) throw new NotFoundException('Review not found');
    return { message: 'Deleted successfully' };
  }
}