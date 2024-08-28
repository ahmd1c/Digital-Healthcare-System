import { Transform } from 'class-transformer';
import {
  // IsIn,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { IsNumericFilter } from 'src/utils/numeric-field-validator';

// const allowedFields = [
//   'name',
//   'specialization',
//   'schedule_price',
//   'schedule_duration',
//   'approved',
//   'createdAt',
// ];

class NumericFilterQuery {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  gte?: number;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  lte?: number;
}

export class QueryParamsDto {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    value = typeof value === 'string' ? value.split(',') : value;
    return value.map((val: string) =>
      val
        .trim()
        .replaceAll(/(\[|\]|<|>)/g, '')
        .toLowerCase(),
    );
  })
  fields?: string[];

  @IsOptional()
  @IsNumericFilter()
  price?: number | NumericFilterQuery;

  @IsOptional()
  @IsNumericFilter()
  duration?: number | NumericFilterQuery;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return value.trim();
  })
  @Matches(/^(\+|-)?(price|duration|createdAt)/gi)
  sort?: string;

  @IsOptional()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsPositive()
  page?: number;
}
