import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  Param,
  Patch,
  UseGuards,
  Delete,
  SetMetadata,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { QueryParamsDto } from '../utils/query-params.dto';
import { OwnerGuard } from 'src/utils/decorators/owner-guard';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { RolesGuard } from 'src/utils/decorators/Roles-guard';
import { Auth } from 'src/utils/decorators/Auth-decorator';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto, @Request() req) {
    return this.doctorsService.create({ ...createDoctorDto, id: req.user?.id });
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne({ doc_id: +id });
  }

  @Auth('ADMIN', 'DOCTOR')
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
