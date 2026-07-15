import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../../domain/models/review.model';
import { ReviewEntity } from './review.entity';
import { ReviewMapper } from '../../../application/mappers/review.mapper';
import { IReviewWriteRepository } from '../../../domain/repositories/review-write.repository.interface';

@Injectable()
export class PostgresReviewWriteRepository implements IReviewWriteRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly pgRepository: Repository<ReviewEntity>,
  ) {}

  async save(review: Review): Promise<void> {
    // The mapper ensures we map from the domain object to the relational object format
    const persistenceEntity = ReviewMapper.toPostgres(review); 
    await this.pgRepository.save(persistenceEntity);
  }

  async findById(id: string): Promise<Review | null> {
    const entity = await this.pgRepository.findOneBy({ id });
    return entity ? ReviewMapper.toDomainFromPostgres(entity) : null;
  }

  async findByProduct(productId: string): Promise<Review[]> {
    const entities = await this.pgRepository.findBy({ productId });
    return entities.map(ReviewMapper.toDomainFromPostgres);
  }

  async delete(id: string): Promise<void> {
    await this.pgRepository.delete({ id });
  }
}