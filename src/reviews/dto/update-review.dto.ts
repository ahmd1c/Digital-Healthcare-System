import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PickType(PartialType(CreateReviewDto), [
  'comment',
  'rating',
]) {}
