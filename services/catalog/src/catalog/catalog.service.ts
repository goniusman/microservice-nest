import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  // Internal K8s service URL fallback if env isn't provided
  private readonly bookServiceUrl = process.env.BOOK_SERVICE_URL || 'http://localhost:3002';

  constructor(private readonly httpService: HttpService) {}

  async fetchExternalBooks() {
    try {
        console.log(`Attempting to fetch books from: ${this.bookServiceUrl}/books`);
      // Call the existing REST microservice endpoint /books
      const response = await firstValueFrom(
        this.httpService.get(`${this.bookServiceUrl}/books`)
      );
      return response.data; // Assumes it returns an array of books
    } catch (error:any) {
      this.logger.error(`Failed to fetch books from book-service: ${error.message}`);
      throw new Error('Downstream book-service is unavailable.');
    }
  }
}