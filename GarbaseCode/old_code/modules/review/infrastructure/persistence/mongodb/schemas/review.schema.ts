import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<ReviewSchema>;

@Schema({
  collection: 'reviews',
  timestamps: true,
})
export class ReviewSchema {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  bookId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  content: string;

  @Prop({
    required: true,
    enum: ['ACTIVE', 'DELETED'],
  })
  status: string;
}

export const ReviewMongoSchema =
  SchemaFactory.createForClass(ReviewSchema);