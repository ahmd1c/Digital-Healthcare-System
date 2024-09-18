import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DoctorsService } from 'src/doctors/doctors.service';
import { PatientsService } from 'src/patients/patients.service';
import { NotificationService } from 'src/notifications/notification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private doctorService: DoctorsService,
    private patientService: PatientsService,
    private notificationService: NotificationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    switch (createUserDto.accType) {
      case 'patient':
        createUserDto.patient = this.patientService.init(createUserDto.patient);
        return this.userRepository.save(user);

      case 'doctor':
        createUserDto.doctor = this.doctorService.init(createUserDto.doctor);
        this.notificationService.notify({
          userId: 1, // admin
          type: 'doctor:new',
          message: `New doctor ${createUserDto.name} has been added and is waiting for approval.`,
        });
        return this.userRepository.save(user);
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(findQuery: FindOptionsWhere<User>, selections?: string[]) {
    selections = selections?.map((selection) => `user.${selection}`);
    return this.userRepository
      .createQueryBuilder('user')
      .select(selections)
      .where(findQuery)
      .getOne();
  }

  update(
    id: number,
    updateUserDto: UpdateUserDto | Partial<User>,
    selections?: string[],
  ) {
    return this.userRepository
      .createQueryBuilder()
      .update(updateUserDto)
      .where({ id })
      .returning(selections || ['*'])
      .execute();
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
