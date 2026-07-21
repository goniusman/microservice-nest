import { Controller, Post, Body, Get, Param, Put, Delete, Query, Patch, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReviewDto } from './dtos/create-review.dto';
import { CreateReviewCommand } from '../../application/commands/create-review.command';
import { ReviewResponseDto } from './dtos/review-response.dto';
import { GetReviewsByProductQuery } from '../../application/queries/get-reviews-product.query';
import { UpdateReviewCommand } from '../../application/commands/update-review.command';
import { DeleteReviewCommand } from '../../application/commands/delete-review.command';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { GetReviewByIdQuery } from '../../application/queries/get-review.query';
import { GetReviewsQueryDto } from './dtos/get-reviews-query.dto';
import { PaginatedReviewsResponseDto } from './dtos/paginated-reviews-response.dto';
import { PermissionGuard } from '@my-app/shared';

@Controller('reviews')
@UseGuards(PermissionGuard)
export class ReviewController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post()
  async createReview(@Body() dto: CreateReviewDto) {
    const command = new CreateReviewCommand(
      dto.productId,
      dto.userId,
      dto.rating,
      dto.comment,
      dto.isPremiumUser,
      dto.isVerifiedUser,
      dto.bookId
    );

    const reviewId = await this.commandBus.execute(command);
    return { success: true, id: reviewId };
  }

  @Get(':id')
  async getByID(
    @Param('id') id: string,
    @Query() paginationDto: GetReviewsQueryDto,
  ): Promise<ReviewResponseDto> {
    const query = new GetReviewByIdQuery(
      id,
      paginationDto.page,
      paginationDto.limit,);
    return await this.queryBus.execute(query);
  }

  @Get('book/:bookId')
  async getByProduct(
    @Param('productId') productId: string,
    @Query() paginationDto: GetReviewsQueryDto, // Bind URL query strings (?page=1&limit=20)
  ): Promise<PaginatedReviewsResponseDto> {
    const query = new GetReviewsByProductQuery(
      productId,
      paginationDto.page,
      paginationDto.limit,
    );
    return await this.queryBus.execute(query);
  }

  // @Get('product/:productId')
  // async getByProduct(@Param('productId') productId: string): Promise<ReviewResponseDto[]> {
  //   const query = new GetReviewsByProductQuery(productId);
  //   return await this.queryBus.execute(query);
  // }

  @Patch(':id')
  async updateReview(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    const command = new UpdateReviewCommand(
      id, 
      dto.rating, 
      dto.comment, 
      // dto.reviewId, 
      // dto.productId, 
      // dto.userId, 
      dto.isPremiumUser, 
      dto.isVerifiedUser, 
      // dto.bookId, 
      dto.reportCount, 
      dto.isAuthorBlocked, dto.isSoftDeleted, 
      dto.isHidden, 
      // dto.createdAt, 
      // dto.editHistory
    );
    await this.commandBus.execute(command);
    return { success: true, message: 'Review updated successfully' };
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    const command = new DeleteReviewCommand(id);
    await this.commandBus.execute(command);
    return { success: true, message: 'Review deleted successfully' };
  }

}