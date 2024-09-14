import { Optional } from '@nestjs/common';
import { IsInt } from 'class-validator';

export class PrescritptoinParamtDto {
  @Optional()
  @IsInt()
  patientId: number;

  @Optional()
  @IsInt()
  appointmentId: number;

  @Optional()
  @IsInt()
  doctorId: number;
}
