import { Entity } from './entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  private readonly domainEvents: unknown[] = [];

  protected addDomainEvent(event: unknown): void {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): unknown[] {
    const events = [...this.domainEvents];

    this.domainEvents.length = 0;

    return events;
  }
}