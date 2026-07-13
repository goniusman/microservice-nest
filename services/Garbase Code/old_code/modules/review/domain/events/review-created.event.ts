import { DomainEvent } from '../../../../shared/domain/domain-event';

export class ReviewCreatedEvent implements DomainEvent {
  occurredOn = new Date();

  constructor(
    public readonly reviewId: string,
    public readonly userId: string,
    public readonly bookId: string,
  ) {}
}