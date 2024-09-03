import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
} from 'class-validator';

export class CreateDocExperienceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  hospital: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @IsDate()
  @MaxDate(new Date())
  from: Date;

  @IsOptional()
  @IsDate()
  to: Date;
}
