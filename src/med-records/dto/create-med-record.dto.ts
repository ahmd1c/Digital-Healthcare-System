import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class Allergy {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  type: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;
}

export class PastSurgery {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;
}

export class CreateMedRecordDto {
  @IsNotEmpty()
  @MaxLength(3)
  @Transform((params) => params.value.toUpperCase())
  blood_group: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Allergy)
  allergies: Allergy[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => PastSurgery)
  past_surgeries: PastSurgery[];

  @IsBoolean()
  smooker: boolean;

  @IsOptional()
  @IsNumber()
  cigarets_per_day: number;

  @IsPositive()
  height: number; // in cm

  @IsOptional()
  @IsNumber()
  @Min(0)
  parity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gravidity: number;
}
