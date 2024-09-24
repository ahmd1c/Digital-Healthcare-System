import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class MsgDto {
  @IsInt()
  from: number;

  @IsInt()
  to: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
