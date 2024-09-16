import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePassDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  newPassword: string;
}
