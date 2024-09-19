import { Module } from '@nestjs/common';
import { MedRecordsService } from './med-records.service';
import { MedRecordsController } from './med-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedRecord } from './entities/med-record.entity';
import { MedRecordPermissions } from 'src/permissions/medRecord-permissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedRecord, MedRecordPermissions])],
  controllers: [MedRecordsController],
  providers: [MedRecordsService],
  exports: [MedRecordsService],
})
export class MedRecordsModule {}
