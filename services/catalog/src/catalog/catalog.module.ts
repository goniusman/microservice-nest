import { Module } from '@nestjs/common';
import { CatalogResolver } from './catalog.resolver';
import { CatalogService } from './catalog.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookItem, CatalogItem } from './models/catalog.model';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([CatalogItem, BookItem]), // Add your entities here if needed
  ],
  providers: [CatalogResolver, CatalogService]
})
export class CatalogModule { }
