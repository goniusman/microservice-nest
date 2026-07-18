import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'reviews' })
export class ReviewDocument extends Document {
  @Prop({ required: true, type: String })
   id: string;

  @Prop({ required: true, type: String })
  productId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  bookId: string; 

  @Prop({ required: true })
  isVerifiedUser: boolean;

  @Prop({ required: true })
  isPremiumUser: boolean;

  @Prop({ required: true })
  reportCount: number;  

  @Prop({ required: true })
  isAuthorBlocked: boolean;

  @Prop({ required: true })
  isSoftDeleted: boolean;

  @Prop({ required: true })
  isHidden: boolean;

  @Prop({ type: [{ rating: Number, comment: String, editedAt: Date }] })
  editHistory: { rating: number; comment: string; editedAt: Date }[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewDocument);