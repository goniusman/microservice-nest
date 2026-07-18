
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { DogHealthIndicator } from './dog.health.service';
import { TerminusLogger } from '../common/interceptors/terminus-logger.service';

@Module({
    imports: [
        TerminusModule.forRoot({
            logger: TerminusLogger,
            // logger: false,
            // errorLogStyle: 'pretty',
            // gracefulShutdownTimeoutMs: 1000,
        }),
        HttpModule
    ],
    controllers: [HealthController],
    providers: [DogHealthIndicator]
})
export class HealthModule { }
