
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TypeOrmHealthIndicator, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        // private health: HealthCheckService,
        // private http: HttpHealthIndicator,
        // private db: TypeOrmHealthIndicator,
        // @InjectConnection('albumsConnection')
        // private albumsConnection: Connection,
        // @InjectConnection()
        // private defaultConnection: Connection,
        // private readonly disk: DiskHealthIndicator,
        // private memory: MemoryHealthIndicator,

    ) { }


    @Get('live')
    live() {
        return { status: 'ok' };
    }

    @Get('ready')
    ready() {
        return { status: 'ready' };
    }


    //   @Get()
    //   @HealthCheck()
    //   check() {
    //     return this.health.check([
    //       () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    //     ]);
    //   }


    // @Get()
    // @HealthCheck()
    // check() {
    //     return this.health.check([
    //         () =>
    //             this.http.responseCheck(
    //                 'my-external-service',
    //                 'https://my-external-service.com',
    //                 (res) => res.status === 204,
    //             ),
    //     ]);
    // }


    // @Get()
    // @HealthCheck()
    // check() {
    //     return this.health.check([
    //         () => this.db.pingCheck('database'),
    //     ]);
    // }


    // @Get()
    // @HealthCheck()
    // check() {
    //     return this.health.check([
    //         () => this.db.pingCheck('albums-database', { connection: this.albumsConnection }),
    //         () => this.db.pingCheck('database', { connection: this.defaultConnection }),
    //     ]);
    // }


    // @Get()
    // @HealthCheck()
    // check() {
    //     return this.health.check([
    //         () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
    //     ]);
    // }


    // @Get()
    // @HealthCheck()
    // check() {
    //     return this.health.check([
    //         () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    //     ]);
    // }

    // @Get()
    // @HealthCheck()
    // healthCheck() {
    //     try {
    //         return this.health.check([
    //             () => this.dogHealthIndicator.isHealthy('dog'),
    //         ])
    //     } catch (err) {
    //         throw err;
    //     }

    // }

}
