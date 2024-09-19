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
import { MedRecordsService } from './med-records.service';
import { CreateMedRecordDto } from './dto/create-med-record.dto';
import { UpdateMedRecordDto } from './dto/update-med-record.dto';
import { OwnerGuard } from 'src/auth/guards/owner-guard';
import { PermittedGuard } from 'src/permissions/medRecord_doctor.guard';
import User from 'src/utils/decorators/USER.decorator';

@Controller('/patients/:id/med-records')
export class MedRecordsController {
  constructor(private readonly medRecordsService: MedRecordsService) {}

  @UseGuards(OwnerGuard)
  @Post()
  create(@Body() createMedRecordDto: CreateMedRecordDto, @User() user) {
    console.log('createMedRecordDto', createMedRecordDto);

    return this.medRecordsService.create(createMedRecordDto, user.id);
  }

  @UseGuards(PermittedGuard)
  @Get(':recordId')
  findOne(@Param('recordId') recordId: string) {
    return this.medRecordsService.findOne(+recordId);
  }

  @UseGuards(OwnerGuard)
  @Patch(':recordId')
  update(
    @Param('recordId') recordId: string,
    @Body() updateMedRecordDto: UpdateMedRecordDto,
  ) {
    return this.medRecordsService.update(+recordId, updateMedRecordDto);
  }

  @UseGuards(OwnerGuard)
  @Delete(':recordId')
  remove(@Param('recordId') recordId: string) {
    return this.medRecordsService.remove(+recordId);
  }
}
