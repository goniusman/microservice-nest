import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true, index: true })
  author: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  quantity: number;

  @Prop({ type: Boolean, required: true, default: false })
  isPublished: boolean; 
}

export const BookSchema = SchemaFactory.createForClass(Book);
// Text Index for global book searching (allows searching via text queries)
BookSchema.index({ title: 'text', author: 'text' });


