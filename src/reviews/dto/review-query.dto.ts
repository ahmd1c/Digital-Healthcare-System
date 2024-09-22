import { IsInt, IsOptional } from 'class-validator';

export class ReviewParamtDto {
  @IsOptional()
  @IsInt()
  patient_id?: number;

  @IsOptional()
  @IsInt()
  doc_id?: number;
}
