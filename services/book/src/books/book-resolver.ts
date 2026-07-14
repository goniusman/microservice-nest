
import { Resolver, Query, Mutation, Args, Context, ID } from '@nestjs/graphql';
import { BookGenre, BookType } from './graphql-type/book.type';
import { CreateBookInput } from './graphql-type/create-book.input';
import { BooksService } from './books.service';
import { UpdateBookInput } from './graphql-type/update-book.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
// import { BookType } from './book.type';
// import { CreateBookInput } from './create-book.input';

@Resolver(() => BookType)
export class BookResolver {
  // Inject your Mongoose model or service here via constructor
  constructor(private readonly bookService: BooksService) {}

  

// 2. Dynamic Fetch: Pull all books from MongoDB
  @Query(() => [BookType], { name: 'books' })
  @UseGuards(GqlAuthGuard)
  async getBooks(@CurrentUser() user: any): Promise<BookType[]> {
    const books = await this.bookService.findAll();
    
    // Mongoose maps _id to id when lean() is used, or GraphQL handles the string conversion
    return books.map(book => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      quantity: book.quantity,
      isPublished: book.isPublished,
      genre: book.genre, // Ensure this matches your enum/string mapping
      createdAt: book.createdAt,
    }));
  }


@Mutation(() => BookType, { name: 'createBook' })
  async createBook(
    @Args('input') input: CreateBookInput // This expects an outer "input" object in variables
  ): Promise<BookType> {
  console.log("Raw Input:", input);
  console.log("Spread Input:", { ...input });
    // FIX: Destructure the input object into your Mongoose service.
    // If you pass 'input' directly, Mongoose receives { input: { title: "..." } } instead of { title: "..." }
    const newBook = await this.bookService.create({ ...input });
    
try {
  // const newBook = await this.bookService.create({ ...input });
      return newBook;
} catch (e) {
  console.error(e);
  throw e;
}


    // // Explicitly return it transformed to match your GraphQL ObjectType fields
    // return {
    //   id: newBook._id.toString(),
    //   title: newBook.title,
    //   author: newBook.author,
    //   description: newBook.description || '',
    //   price: newBook.price,
    //   quantity: newBook.quantity,
    //   genre: newBook.genre,
    //   isPublished: newBook.isPublished,
    //   createdAt: (newBook as any).createdAt,
    // };
  }


  @Mutation(() => BookType, { name: 'updateBook' })
async updateBook(
  @Args('input') input: UpdateBookInput
): Promise<BookType> {
  const { id, ...updateData } = input;
  
  const updatedBook = await this.bookService.update(id, updateData);
  if (!updatedBook) {
    throw new Error(`Book with ID ${id} not found`);
  }

  return {
    id: updatedBook._id.toString(),
    title: updatedBook.title,
    author: updatedBook.author,
    description: updatedBook.description || '',
    price: updatedBook.price,
    quantity: updatedBook.quantity,
    isPublished: updatedBook.isPublished,
    genre: updatedBook.genre
  };
}


// src/book/book.resolver.ts
@Mutation(() => BookType, { name: 'deleteBook', nullable: true })
async deleteBook(
  @Args('id', { type: () => ID }) id: string
): Promise<BookType | null> {
  const deletedBook = await this.bookService.delete(id);
  if (!deletedBook) {
    throw new Error(`Book with ID ${id} not found or already deleted`);
  }

  return {
    id: deletedBook._id.toString(),
    title: deletedBook.title,
    author: deletedBook.author,
    description: deletedBook.description || '',
    price: deletedBook.price,
    quantity: deletedBook.quantity,
    isPublished: deletedBook.isPublished,
    genre: deletedBook.genre
  };
}

}




























// import { Resolver, Query, Args } from '@nestjs/graphql';
// // import { BookItem, CatalogItem } from './models/book.model';
// // import { CatalogService } from './catalog.service';
// // import { Book, BookSchema } from './schemas/book.schema';
// import { BooksService } from './books.service';
// import { BookType } from './graphql-type/book.type';
 


// @Resolver(() => Book)
// export class BookResolver {
//   // In a real microservice, this constructor injects a service that communicates
//   // with 'book-service' or 'order-service' over gRPC/REST.
//   constructor(private readonly bookService: BooksService) { }

//   // @Query(() => [BookSchema], { name: 'catalog', description: 'Get all catalog items' })
//   // async getCatalog(): Promise<Book[]> {
//   //   return [
//   //     { id: '1', title: 'The Cloud Native Architecture Blueprint', price: 49.99 },
//   //     { id: '2', title: 'Mastering NestJS and GraphQL', price: 39.99 }
//   //   ];
//   // }

//   // YOUR NEW QUERY: Fetches dynamically from the /books microservice
//   @Query(() => [Book], { name: 'externalBooks', description: 'Fetches books from the legacy REST service' })
//   async getExternalBooks(): Promise<Book[]> {
//     const books = await this.bookService.findAll();
//     console.log('Books fetched from book-service:', books);
//     // Map the incoming REST JSON data keys to match your GraphQL ObjectType fields if necessary
//     // return books?.map((book: any) => ({
//     //   id: book.id || book._id,
//     //   title: book.title,
//     //   price: book.price || 0.0,
//     //   description: book.description || '',
//     //   quantity: book.quantity || 0
//     // }));

//     return books
//   }


// }