import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { QueryService } from 'src/utils/query-prepare.service';
import { MedRecordsModule } from 'src/med-records/med-records.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), MedRecordsModule],
  controllers: [PatientsController],
  providers: [PatientsService, QueryService],
  exports: [PatientsService],
})
export class PatientsModule {}
