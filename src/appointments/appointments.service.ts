import { AppointmenParamtDto } from './dto/queryParam-appointment.dto';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { TimeslotsService } from 'src/timeslots/timeslots.service';
import { NotificationService } from 'src/notifications/notification.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import MailService from 'src/utils/mail.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly timeslotService: TimeslotsService,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
  ) {}

  async create(appointmentDto: CreateAppointmentDto) {
    await this.checkAvailability(appointmentDto);
    const appointment = this.appointmentRepo.create({
      ...appointmentDto,
      patient: { patient_id: appointmentDto.patient_id },
      doctor: { doc_id: appointmentDto.doc_id },
      timeslot: { id: appointmentDto.timeslot_id },
      status: 'pending',
    });
    const newAppointment = await this.appointmentRepo.save(appointment);
    return {
      message: 'appointment created successfully',
      appointment: newAppointment,
    };
  }

  findAll(
    appointmenParam: AppointmenParamtDto,
    user?: { id: number; role: string },
  ) {
    // this function can be used in other services so !user for internal usage
    // but for req from client auth is required and guard is used
    if (user.role === 'admin' || !user) {
      return this.appointmentRepo.find({
        where: [
          {
            patient: { patient_id: appointmenParam?.patient_id },
          },
          {
            doctor: { doc_id: appointmenParam?.doc_id },
          },
        ],
      });
    }
    return this.appointmentRepo.find({
      where: {
        patient: user.role === 'patient' && { patient_id: user.id },
        doctor: user.role === 'doctor' && { doc_id: user.id },
      },
    });
  }

  async findOne(id: number, user?) {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (user) {
      await this.checkAccess(appointment, user);
    }
    if (!appointment) throw new NotFoundException('appointment does not exist');
    return appointment;
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    user: { id: number; role: string },
  ) {
    const appointment = await this.findOne(id);
    if (!appointment)
      throw new BadRequestException('appointment does not exist');

    await this.checkAccess(appointment, user);
    await this.checkAvailability({
      ...updateAppointmentDto,
      doc_id: appointment.doctor.doc_id,
      patient_id: appointment.patient.patient_id,
    });

    this.notificationService.notify({
      userId:
        user.role === 'patient'
          ? appointment.doctor.doc_id
          : appointment.patient.patient_id,
      type: 'appointment:update',
      message: 'your appointment with id ' + id + ' has been updated',
    });
    await this.appointmentRepo.update(id, updateAppointmentDto);
    return {
      message: 'appointment updated successfully',
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendAlarms() {
    const appointments = await this.appointmentRepo
      .createQueryBuilder('a')
      .where('a.status = :status', { status: 'accepted' })
      .andWhere('a.date > :date', { date: new Date() })
      .andWhere('a.date < :tomorrow', {
        tomorrow: new Date(new Date().setDate(new Date().getDate() + 1)),
      })
      .innerJoinAndSelect('a.doctor', 'd', 'a.doc_id = d.doc_id')
      .innerJoinAndSelect('a.patient', 'p', 'a.patient_id = p.patient_id')
      .innerJoinAndSelect('d.user', 'u', 'd.doc_id = u.id', {
        name: true,
        email: true,
      })
      .innerJoinAndSelect('p.user', 'u2', 'p.patient_id = u2.id', {
        name: true,
        email: true,
      })
      .getMany();

    for (const appointment of appointments) {
      this.mailService.sendMail({
        to: appointment.patient.user.email,
        subject: 'appointment reminder',
        html: `<p>hello ${appointment.patient.user.name}
         you have an appointment with ${appointment.doctor.user.name} in ${appointment.date}</p>`,
      });

      this.mailService.sendMail({
        to: appointment.doctor.user.email,
        subject: 'appointment reminder',
        html: `<p>hello ${appointment.doctor.user.name}
         you have an appointment with ${appointment.patient.user.name} in ${appointment.date}</p>`,
      });
    }
  }

  async confirm(id: number, user: { id: number; role: string }) {
    const appointment = await this.findOne(id);
    if (!appointment) {
      throw new NotFoundException('appointment does not exist');
    }
    await this.checkAccess(appointment, user);
    await this.appointmentRepo.update(id, { status: 'confirmed' });
    this.notificationService.notify({
      userId: appointment.patient.patient_id,
      type: 'appointment:confirm',
      message: 'your appointment with id ' + id + ' has been confirmed',
    });
    return {
      success: true,
      message: 'appointment confirmed successfully',
    };
  }

  async cancel(id: number, user: { id: number; role: string }) {
    const appointment = await this.findOne(id);
    if (!appointment) {
      throw new NotFoundException('appointment does not exist');
    }
    await this.checkAccess(appointment, user);
    await this.appointmentRepo.update(id, { status: 'cancelled' });

    const { patient, doctor } = appointment;

    const notifyObj = {
      type: 'appointment:cancel',
      message: 'your appointment with id ' + id + ' has been cancelled',
    };

    if (user.role === 'admin') {
      for (const i of 'dp') {
        this.notificationService.notify({
          ...notifyObj,
          userId: i === 'd' ? doctor.doc_id : patient.patient_id,
        });
      }
    }
    this.notificationService.notify({
      ...notifyObj,
      userId: user.role === 'patient' ? doctor.doc_id : patient.patient_id,
    });
    return {
      success: true,
      message: 'appointment cancelled successfully',
    };
  }

  private async checkAccess(
    appointment: Appointment,
    user: { id: number; role: string },
  ) {
    if (
      appointment.patient.patient_id !== user.id ||
      appointment.doctor.doc_id !== user.id ||
      user.role !== 'admin'
    ) {
      throw new HttpException('unauthorized access', 403);
    }
  }

  async checkAvailability(appointmentDto: Partial<CreateAppointmentDto>) {
    const timeslot = await this.timeslotService.findOne(
      appointmentDto.timeslot_id,
    );
    if (!timeslot) throw new BadRequestException('timeslot does not exist');

    switch (timeslot.type) {
      case 'unavailable':
        throw new BadRequestException('unavailable timeslot');

      case 'recurrent':
        if (!timeslot.days.includes(new Date(appointmentDto.date).getDay()))
          throw new BadRequestException('unavailable timeslot for this day');
        break;

      case 'single':
        if (timeslot.date !== appointmentDto.date)
          throw new BadRequestException('invalid date for this timeslot');
        break;
    }

    const hadAppointment = await this.appointmentRepo
      .createQueryBuilder('a')
      .where(`a.doc_id = :doc_id`, { doc_id: appointmentDto.doc_id })
      .orWhere(`a.patient_id = :patient_id`, {
        patient_id: appointmentDto.patient_id,
      })
      .andWhere({
        date: appointmentDto.date,
        timeslot: { id: appointmentDto.timeslot_id },
      })
      .getCount();
    if (hadAppointment) {
      throw new ConflictException(
        'either doctor or patient have appointment in this time range',
      );
    }
  }
}
