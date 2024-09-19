import { Injectable } from '@nestjs/common';
import { CreateMedRecordDto } from './dto/create-med-record.dto';
import { UpdateMedRecordDto } from './dto/update-med-record.dto';
import { Repository } from 'typeorm';
import { MedRecord } from './entities/med-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MedRecordPermissions } from 'src/permissions/medRecord-permissions.entity';

@Injectable()
export class MedRecordsService {
  constructor(
    @InjectRepository(MedRecord)
    private medRecordRepository: Repository<MedRecord>,
    @InjectRepository(MedRecordPermissions)
    private medRecPermissionsRepository: Repository<MedRecordPermissions>,
  ) {}

  async create(createMedRecordDto: CreateMedRecordDto, id: number) {
    const medRecord = this.medRecordRepository.create({
      ...createMedRecordDto,
      med_record_id: id,
    });
    const record = await this.medRecordRepository.save(medRecord);
    return {
      medRecord: record,
      message: 'Med record created successfully',
    };
  }

  findOne(id: number) {
    return this.medRecordRepository.findOne({
      where: { med_record_id: id },
      relations: ['med_history', 'patientMedication'],
    });
  }

  /**
   *
   * @param recordId
   * @param doctorId
   * @description used in permission guard
   */
  async checkRecordPermission(recordId: number, doctorId: number) {
    return await this.medRecPermissionsRepository.findOne({
      where: {
        medRecord: { med_record_id: recordId },
        doctor: { doc_id: doctorId },
      },
    });
  }

  async update(id: number, updateMedRecordDto: UpdateMedRecordDto) {
    await this.medRecordRepository.update(id, updateMedRecordDto);
    return {
      message: 'Med record updated successfully',
    };
  }

  async remove(id: number) {
    await this.medRecordRepository.delete(id);
    return {
      message: 'Med record deleted successfully',
    };
  }
}
