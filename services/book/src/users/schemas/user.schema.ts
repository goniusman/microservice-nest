// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type UserDocument = User & Document;

// @Schema({ timestamps: true })
// export class User extends Document {

//   @Prop({ required: false, trim: true })
//   name: string;

//   @Prop({ required: false, trim: true })
//   email: string;

//   @Prop({ type: String, default: '' })
//   status: string;

//   @Prop({ required: true, min: 0 })
//   userId: number;

// }

// export const UserSchema = SchemaFactory.createForClass(User);
// // Text Index for global User searching (allows searching via text queries)
// // UserSchema.index({ name: 'text', email: 'text' });


