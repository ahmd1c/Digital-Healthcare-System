import { IsInt, IsJSON } from 'class-validator';

export class CreatePrescriptionDto {
  @IsInt()
  appointmentId: number;

  @IsJSON()
  prescription: string;
}
