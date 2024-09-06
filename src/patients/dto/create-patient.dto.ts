import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDate,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
  MaxDate,
} from 'class-validator';

export class CreatePatientDto {
  @IsAlpha()
  marital_status: string;

  @IsAlpha()
  occupation: string;

  @IsAlpha()
  nationality: string;

  @IsNotEmpty()
  @Length(10, 15)
  @IsPhoneNumber()
  emergency_phone: string;

  @IsNotEmpty()
  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  date_of_birth: Date;
}
