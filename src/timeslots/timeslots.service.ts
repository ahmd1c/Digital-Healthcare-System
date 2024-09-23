import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Timeslot } from './entities/timeslot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TimeslotsService {
  constructor(
    @InjectRepository(Timeslot)
    private readonly timeslotRepository: Repository<Timeslot>,
  ) {}

  async create(createTimeslotDto: CreateTimeslotDto, doctorId: number) {
    const slot = this.timeslotRepository.create({
      ...createTimeslotDto,
      doctor: { doc_id: doctorId },
    });
    const timeslot = await this.timeslotRepository.save(slot);
    return {
      timeslot,
      message: 'Timeslot created successfully',
    };
  }

  findAll(doctorId: number) {
    return this.timeslotRepository.find({
      where: { doctor: { doc_id: doctorId } },
    });
  }

  async findOne(id: number) {
    const timeslot = await this.timeslotRepository.findOne({ where: { id } });
    if (!timeslot) {
      throw new NotFoundException('Timeslot not found');
    }
    return timeslot;
  }

  async update(id: number, updateTimeslotDto: UpdateTimeslotDto) {
    const { affected } = await this.timeslotRepository.update(
      id,
      updateTimeslotDto,
    );
    if (!affected) {
      throw new NotFoundException('Timeslot not found');
    }
    return {
      success: !!affected,
    };
  }

  async remove(id: number) {
    const { affected } = await this.timeslotRepository.delete(id);
    if (!affected) {
      throw new NotFoundException('Timeslot not found');
    }
    return {
      success: !!affected,
      msg: `${affected ? 'Deleted' : 'Not found'}`,
    };
  }
}
