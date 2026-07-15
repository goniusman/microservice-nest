import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  userId: string;

  @Column('int')
  rating: number;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'book_id', nullable: true })
  bookId: string;

  @Column({ name: 'is_verified_user', nullable: true })
  isVerifiedUser: boolean;

  @Column({ name: 'is_premium_user', nullable: true })
  isPremiumUser: boolean;

  @Column({ name: 'report_count', nullable: true })
  reportCount: number;

  @Column({ name: 'is_author_blocked', nullable: true })
  isAuthorBlocked: boolean;

  @Column({ name: 'is_soft_deleted', nullable: true })
  isSoftDeleted: boolean;

  @Column({ name: 'is_hidden', nullable: true })
  isHidden: boolean;

  @Column({ name: 'edit_history', type: 'jsonb', nullable: true })
  editHistory: { rating: number; comment: string; editedAt: Date }[];

}