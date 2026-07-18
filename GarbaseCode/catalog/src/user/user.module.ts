import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { BookItem, CatalogItem } from '../catalog/models/catalog.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
     TypeOrmModule.forFeature([User]),
  ],
  providers: [UserResolver]
})
export class UserModule {}
