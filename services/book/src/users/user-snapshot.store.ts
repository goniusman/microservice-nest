
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';


@Injectable()
export class UserSnapshotStore {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ){}

  upsert(user: any) {
    console.log('user inserted by event in book service')
    this.userModel.create(user)
  }

  find(userId: string) {
    console.log('user inserted by event in book service')
    return this.userModel.findById(userId);
  }
}