import { IsDateString, IsIn, IsInt, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsIn(['visit', 'telemedicine'])
  type: string;

  @IsNotEmpty()
  @IsInt()
  doc_id: number;

  @IsNotEmpty()
  @IsInt()
  patient_id: number;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsInt()
  timeslot_id: number;
}
