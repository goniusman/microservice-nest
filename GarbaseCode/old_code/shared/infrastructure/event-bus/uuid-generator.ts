import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import {
  IdGenerator,
} from '../application/id-generator';

@Injectable()
export class UuidGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}