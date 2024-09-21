import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PatientMedicationsService } from './patient_medications.service';
import { CreatePatientMedicationDto } from './dto/create-patient_medication.dto';
import { UpdatePatientMedicationDto } from './dto/update-patient_medication.dto';
import { PermittedGuard } from 'src/permissions/medRecord_doctor.guard';
import { OwnerGuard } from 'src/auth/guards/owner-guard';

@Controller('/patients/:id/med-records/:recordId/medications')
export class PatientMedicationsController {
  constructor(
    private readonly patientMedicationsService: PatientMedicationsService,
  ) {}

  @UseGuards(OwnerGuard)
  @Post()
  create(@Body() createPatientMedicationDto: CreatePatientMedicationDto) {
    return this.patientMedicationsService.create(createPatientMedicationDto);
  }
  @UseGuards(PermittedGuard)
  @Get()
  findAll(@Param('recordId') recordId: string) {
    return this.patientMedicationsService.findAll(+recordId);
  }

  @UseGuards(PermittedGuard)
  @Get(':medicationId')
  findOne(@Param('medicationId') medicationId: string) {
    return this.patientMedicationsService.findOne(+medicationId);
  }

  @UseGuards(OwnerGuard)
  @Patch(':medicationId')
  update(
    @Param('medicationId') medicationId: string,
    @Body() updatePatientMedicationDto: UpdatePatientMedicationDto,
  ) {
    return this.patientMedicationsService.update(
      +medicationId,
      updatePatientMedicationDto,
    );
  }

  @UseGuards(OwnerGuard)
  @Delete(':medicationId')
  remove(@Param('medicationId') medicationId: string) {
    return this.patientMedicationsService.remove(+medicationId);
  }
}
