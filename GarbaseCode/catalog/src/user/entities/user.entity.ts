import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@ObjectType({ description: 'Represents a user in the system' })
@Entity('users')
export class User {

  @Field(() => Int, { description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ description: 'Email address of the user' })
  @Column({
    unique: true,
  })
  email: string;

  @Field({ description: 'Password of the user' })
  @Column()
  password: string;

  @Field({ description: 'Status of the user' })
  @Column({ default: 'ACTIVE' })
  status: string;

  @Field({ description: 'Role of the user' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Field({ description: 'Refresh token for the user' })
  @Column({
    nullable: true,
  })
  refreshToken: string;


  @Field({ description: 'Date when the user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'Date when the user was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}