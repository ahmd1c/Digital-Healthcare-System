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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import User from 'src/utils/decorators/USER.decorator';
import { Auth } from 'src/utils/decorators/Auth-decorator';
import { OwnerGuard } from 'src/auth/guards/owner-guard';
import { PermittedGuard } from 'src/permissions/medRecord_doctor.guard';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Auth('admin')
  @Post()
  create(@Body() createPatientDto: CreatePatientDto, @User() user) {
    return this.patientsService.create({
      ...createPatientDto,
      id: user?.id,
    });
  }

  @Auth('admin')
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @UseGuards(PermittedGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne({ patient_id: +id });
  }

  @Auth('admin', 'patient')
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Auth('admin', 'patient')
  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
