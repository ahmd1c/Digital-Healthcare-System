import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateMedHistoryDto } from './dto/create-med_history.dto';
import { UpdateMedHistoryDto } from './dto/update-med_history.dto';
import { MedHistory } from './entities/med_history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedHistoryService {
  constructor(
    @InjectRepository(MedHistory)
    private readonly medHistoryRepo: Repository<MedHistory>,
  ) {}

  async create(createMedHistoryDto: CreateMedHistoryDto) {
    const medHistory = this.medHistoryRepo.create(createMedHistoryDto);
    const result = await this.medHistoryRepo.save(medHistory);
    return {
      medHistory: result,
      message: 'Med history created successfully',
    };
  }

  findAll(recordId: number) {
    return this.medHistoryRepo.find({
      where: { med_record: { med_record_id: recordId } },
    });
  }

  findOne(id: number) {
    return this.medHistoryRepo.findOne({ where: { id } });
  }

  async update(id: number, updateMedHistoryDto: UpdateMedHistoryDto) {
    await this.medHistoryRepo.update(id, updateMedHistoryDto);
    return {
      message: 'Med history updated successfully',
    };
  }

  async remove(id: number) {
    await this.medHistoryRepo.delete(id);
    return {
      message: 'Med history deleted successfully',
    };
  }
}
