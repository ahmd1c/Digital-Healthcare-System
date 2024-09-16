import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(8, 50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
