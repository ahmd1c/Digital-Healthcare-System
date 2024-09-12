import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateDoctorDto } from 'src/doctors/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patients/dto/create-patient.dto';

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
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(['patient', 'doctor'])
  accType: string;

  @IsNotEmpty()
  @Length(10, 15)
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(1)
  @Transform(({ value }) => value.toUpperCase())
  gender: string;

  @ValidateIf((o) => o.accType === 'doctor')
  @IsNotEmpty()
  @Type(() => CreateDoctorDto)
  @ValidateNested()
  doctor?: CreateDoctorDto;

  @ValidateIf((o) => o.accType === 'patient')
  @IsNotEmpty()
  @Type(() => CreatePatientDto)
  @ValidateNested()
  patient?: CreatePatientDto;
}
