import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryService } from 'src/utils/query-prepare.service';
import { QueryParamsDto } from 'src/utils/query-params.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    private readonly queryService: QueryService,
  ) {}

  async create(createpatientDto: CreatePatientDto & { id: number }) {
    const isDocExists = await this.findOne(
      { patient_id: createpatientDto.id },
      ['patient_id'],
    );
    if (isDocExists) {
      throw new ConflictException('patient already exists');
    }
    const doc = this.patientRepository.create({
      ...createpatientDto,
      patient_id: createpatientDto.id,
    });
    return this.patientRepository.save(doc);
  }

  init(createpatientDto: CreatePatientDto) {
    return this.patientRepository.create(createpatientDto);
  }

  /*
    @access private (only admin)
  */
  async findAll(query?: QueryParamsDto) {
    const qb = this.patientRepository.createQueryBuilder('patient');
    const resultQb = this.queryService.build(qb, query);
    const [data, count] = await resultQb.getManyAndCount();
    const pagination = {
      totalPages: Math.ceil(count / (query?.limit || 10)),
      currentPage: query?.page || 1,
      nextPage: query?.page + 1 || 2,
      prevPage: query?.page - 1 || 0,
    };
    return {
      data,
      pagination,
    };
  }

  findOne(findQuery: FindOptionsWhere<Patient>, selections?: string[]) {
    selections = selections?.map((selection) => `patient.${selection}`);
    return this.patientRepository
      .createQueryBuilder('patient')
      .select(selections)
      .where(findQuery)
      .leftJoinAndSelect('patient.medRecord', 'medRecord')
      .getOne();
  }

  update(id: number, updatepatientDto: UpdatePatientDto) {
    return this.patientRepository.update(id, updatepatientDto);
  }

  remove(id: number) {
    return this.patientRepository.delete(id);
  }
}
