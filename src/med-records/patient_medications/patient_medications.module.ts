import { Module } from '@nestjs/common';
import { PatientMedicationsService } from './patient_medications.service';
import { PatientMedicationsController } from './patient_medications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientMedication } from './entities/patient_medication.entity';
import { MedRecordsModule } from '../med-records.module';

@Module({
  imports: [TypeOrmModule.forFeature([PatientMedication]), MedRecordsModule],
  controllers: [PatientMedicationsController],
  providers: [PatientMedicationsService],
})
export class PatientMedicationsModule {}
