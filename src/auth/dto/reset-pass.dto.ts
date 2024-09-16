import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPassDto {
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
