import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
} from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  specialization: string;

  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  @Max(1000)
  schedule_price: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(120)
  schedule_duration: number; // in minutes

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  education: { degree: string; institution: string; year: number }[];
}
