import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(8, 50)
  email: string;

  @IsNotEmpty()
  @Length(8, 30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 80)
  address: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 7)
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(['PATIENT', 'DOCTOR'])
  accType: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 15)
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(1)
  @Transform(({ value }) => value.toUpperCase())
  gender: string;
}
