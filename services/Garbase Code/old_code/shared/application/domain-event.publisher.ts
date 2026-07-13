import { DomainEvent } from '../domain/domain-event';

export interface DomainEventPublisher {
  publish(events: DomainEvent[]): Promise<void>;
}

export const DOMAIN_EVENT_PUBLISHER = Symbol(
  'DOMAIN_EVENT_PUBLISHER',
);