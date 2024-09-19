import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryService } from 'src/utils/query-prepare.service';
import { QueryParamsDto } from 'src/utils/query-params.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { NotificationService } from 'src/notifications/notification.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
    private readonly queryService: QueryService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto & { id: number }) {
    const isDocExists = await this.findOne({ doc_id: createDoctorDto.id }, [
      'doc_id',
    ]);
    if (isDocExists) {
      throw new ConflictException('Doctor already exists');
    }
    const doc = this.doctorRepository.create({
      ...createDoctorDto,
      doc_id: createDoctorDto.id,
      education: createDoctorDto.education,
    });
    return this.doctorRepository.save(doc);
  }

  init(createDoctorDto: CreateDoctorDto) {
    return this.doctorRepository.create(createDoctorDto);
  }

  async approve(id: number, approved: boolean) {
    const runner = this.doctorRepository.manager.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      await this.doctorRepository.update({ doc_id: id }, { approved });
      await this.notificationService.notify({
        userId: id,
        type: 'doctor:approved',
        message: `Your doctor account has been ${approved ? 'approved' : 'unapproved'}`,
      });
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw new InternalServerErrorException(
        `couldn't ${approved ? 'approve' : 'unapprove'} doctor`,
      );
    } finally {
      await runner.release();
    }
    return {
      success: true,
      message: `doctor ${approved ? 'approved' : 'unapproved'} successfully`,
    };
  }

  async findAll(query?: QueryParamsDto) {
    const qb = this.doctorRepository.createQueryBuilder('doctor');
    const resultQb = this.queryService.build(qb, query);
    const [data, count] = await resultQb
      .leftJoinAndSelect('doctor.experiences', 'exp')
      .getManyAndCount();
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

  findOne(findQuery: FindOptionsWhere<Doctor>, selections?: string[]) {
    selections = selections?.map((selection) => `doctor.${selection}`);
    return this.doctorRepository
      .createQueryBuilder('doctor')
      .select(selections)
      .where(findQuery)
      .leftJoinAndSelect('doctor.experiences', 'exp')
      .getOne();
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return this.doctorRepository.update(id, updateDoctorDto);
  }

  remove(id: number) {
    return this.doctorRepository.delete(id);
  }
}
