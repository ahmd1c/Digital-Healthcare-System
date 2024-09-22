import { Injectable } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
import { Repository } from 'typeorm';
import { PrescritptoinParamtDto } from './dto/prescreption-param.dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
  ) {}

  create(createPrescriptionDto: CreatePrescriptionDto) {
    const prescription = this.prescriptionRepository.create(
      createPrescriptionDto,
    );
    return this.prescriptionRepository.save(prescription);
  }

  findAll(query: PrescritptoinParamtDto, user: { id: number; role: string }) {
    const where = {};
    if (user.role === 'patient') {
      where['appointment']['patient'] = { patient_id: user.id };
    }
    if (user.role === 'doctor') {
      where['appointment']['doctor'] = { doc_id: user.id };
    }
    return this.prescriptionRepository.find({ where });
  }

  async findOne(id: number, user: { id: number; role: string }) {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: { appointment: { patient: true, doctor: true } },
    });
    if (!prescription) throw new Error('prescription not found');
    const { patient, doctor } = prescription.appointment;
    if (
      (user.role === 'patient' && patient.patient_id !== user.id) ||
      (user.role === 'doctor' && doctor.doc_id !== user.id)
    ) {
      throw new Error('unauthorized access');
    }
    return prescription;
  }

  update(
    id: number,
    updatePrescriptionDto: UpdatePrescriptionDto,
    user: { id: number; role: string },
  ) {
    if (user.role === 'admin') {
      return this.prescriptionRepository.update(id, updatePrescriptionDto);
    }
    return this.prescriptionRepository.update(
      { appointment: { doctor: { doc_id: user.id } } },
      updatePrescriptionDto,
    );
  }

  remove(id: number) {
    return this.prescriptionRepository.delete(id);
  }
}
