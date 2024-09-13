import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { QueryParamsDto } from '../utils/query-params.dto';
import { OwnerGuard } from 'src/auth/guards/owner-guard';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { RolesGuard } from 'src/auth/guards/Roles-guard';
import { Auth } from 'src/utils/decorators/Auth-decorator';
import User from 'src/utils/decorators/USER.decorator';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Auth('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto, @User() user) {
    return this.doctorsService.create({ ...createDoctorDto, id: user?.id });
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne({ doc_id: +id });
  }

  @Auth('admin', 'doctor')
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }
}
