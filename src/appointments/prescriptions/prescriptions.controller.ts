import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrescritptoinParamtDto } from './dto/prescreption-param.dto';
import { Auth } from 'src/utils/decorators/Auth-decorator';
import User from 'src/utils/decorators/USER.decorator';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Auth('doctor', 'admin')
  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @Get()
  findAll(@Query() query: PrescritptoinParamtDto, @User() user) {
    return this.prescriptionsService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user) {
    return this.prescriptionsService.findOne(+id, user);
  }

  @Auth('doctor', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
    @User() user,
  ) {
    return this.prescriptionsService.update(+id, updatePrescriptionDto, user);
  }

  @Auth('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(+id);
  }
}
