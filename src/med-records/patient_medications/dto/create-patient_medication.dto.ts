import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsOptional,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreatePatientMedicationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  dose: string;

  @IsIn(['started', 'stopped', 'completed'])
  status: string;

  @IsOptional()
  @IsDateString()
  start_date: Date;

  @IsOptional()
  @IsDateString()
  end_date: Date;
}
