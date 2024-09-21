import { Injectable } from '@nestjs/common';
import { CreatePatientMedicationDto } from './dto/create-patient_medication.dto';
import { UpdatePatientMedicationDto } from './dto/update-patient_medication.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientMedication } from './entities/patient_medication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientMedicationsService {
  constructor(
    @InjectRepository(PatientMedication)
    private medicationsRepo: Repository<PatientMedication>,
  ) {}

  async create(createPatientMedicationDto: CreatePatientMedicationDto) {
    const patientMedication = this.medicationsRepo.create(
      createPatientMedicationDto,
    );
    const medication = await this.medicationsRepo.save(patientMedication);
    return {
      medication,
      message: 'Medication created successfully',
    };
  }

  findAll(recordId: number) {
    return this.medicationsRepo.find({
      where: { med_record: { med_record_id: recordId } },
    });
  }

  findOne(id: number) {
    return this.medicationsRepo.findOne({ where: { id } });
  }

  async update(
    id: number,
    updatePatientMedicationDto: UpdatePatientMedicationDto,
  ) {
    await this.medicationsRepo.update(id, updatePatientMedicationDto);
    return {
      message: 'Medication updated successfully',
    };
  }

  async remove(id: number) {
    await this.medicationsRepo.delete(id);
    return {
      message: 'Medication deleted successfully',
    };
  }
}
