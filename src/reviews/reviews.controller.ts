import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import User from 'src/utils/decorators/USER.decorator';
import { Auth } from 'src/utils/decorators/Auth-decorator';
import { ReviewParamtDto } from './dto/review-query.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Auth('admin', 'patient')
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll(@Query() query: ReviewParamtDto) {
    return this.reviewsService.findAll(query);
  }

  @Get(':reviewId')
  findOne(@Param('reviewId') reviewId: string) {
    return this.reviewsService.findOne(+reviewId);
  }

  @Patch(':reviewId')
  update(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @User() user,
  ) {
    return this.reviewsService.update(+reviewId, updateReviewDto, user?.id);
  }

  @Delete(':reviewId')
  remove(@Param('reviewId') reviewId: string, @User() user) {
    return this.reviewsService.remove(+reviewId, user?.id);
  }
}
