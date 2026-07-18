import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CatalogModule } from './catalog/catalog.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './common/config/database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),

    // PrometheusModule.register({
    //   path: '/metrics', // The path Prometheus will scan
    // }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      autoSchemaFile: true,
      sortSchema: true,
      debug: true,
      playground: true,
      // playground: process.env.NODE_ENV !== 'production',
      // introspection: process.env.NODE_ENV !== 'production',
    }),
    CatalogModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule { }