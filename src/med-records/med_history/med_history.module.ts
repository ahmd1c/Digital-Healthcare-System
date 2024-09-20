import { Module } from '@nestjs/common';
import { MedHistoryService } from './med_history.service';
import { MedHistoryController } from './med_history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedHistory } from './entities/med_history.entity';
import { MedRecordsModule } from '../med-records.module';

@Module({
  imports: [TypeOrmModule.forFeature([MedHistory]), MedRecordsModule],
  controllers: [MedHistoryController],
  providers: [MedHistoryService],
})
export class MedHistoryModule {}
