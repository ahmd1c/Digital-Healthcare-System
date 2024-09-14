import { IsInt, IsOptional } from 'class-validator';

export class AppointmenParamtDto {
  @IsOptional()
  @IsInt()
  patient_id?: number;

  @IsOptional()
  @IsInt()
  doc_id?: number;
}
