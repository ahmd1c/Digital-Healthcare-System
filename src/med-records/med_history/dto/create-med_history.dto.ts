import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMedHistoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  diagnosis: string;

  @IsIn(['cured', 'not_cured'])
  status: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  prescription: string;

  @IsDateString()
  start_date: Date;

  @IsOptional()
  @IsDateString()
  end_date: Date;
}
