import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientMedicationDto } from './create-patient_medication.dto';

export class UpdatePatientMedicationDto extends PartialType(CreatePatientMedicationDto) {}
