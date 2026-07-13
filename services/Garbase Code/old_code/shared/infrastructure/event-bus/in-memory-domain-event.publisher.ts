import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../domain/domain-event';
import { DomainEventPublisher } from '../../application/domain-event.publisher';

@Injectable()
export class InMemoryDomainEventPublisher
  implements DomainEventPublisher
{
  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      console.log(event);
    }
  }
}