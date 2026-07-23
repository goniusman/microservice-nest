import { Module, OnModuleInit } from '@nestjs/common';
import { AuthService, PermissionService, RolesService } from './auth.service';
import { AuthController, PermissionController, RolesController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RedisModule } from '../../dist/shared/redis/redis.module';
// import { REDIS_CLIENT } from '../shared/redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),

    // JwtModule.register({
    //   secret: process.env.JWT_ACCESS_SECRET,
    //   signOptions: {
    //     expiresIn: '15m',
    //   },
    // })

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    // RolesGuard
    RedisModule.register({
      maxRetriesPerRequest: 3,
    }),
  ],
  controllers: [AuthController, PermissionController, RolesController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    PermissionService,
    RolesService
  ],
})
export class AuthModule {}
