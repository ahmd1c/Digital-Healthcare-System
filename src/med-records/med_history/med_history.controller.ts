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
import { MedHistoryService } from './med_history.service';
import { CreateMedHistoryDto } from './dto/create-med_history.dto';
import { UpdateMedHistoryDto } from './dto/update-med_history.dto';
import { OwnerGuard } from 'src/auth/guards/owner-guard';
import { PermittedGuard } from 'src/permissions/medRecord_doctor.guard';

@Controller('/patients/:id/med-records/:recordId/med-history')
export class MedHistoryController {
  constructor(private readonly medHistoryService: MedHistoryService) {}

  @UseGuards(OwnerGuard)
  @Post()
  create(@Body() createMedHistoryDto: CreateMedHistoryDto) {
    return this.medHistoryService.create(createMedHistoryDto);
  }

  @UseGuards(PermittedGuard)
  @Get()
  findAll(@Param('recordId') recordId: string) {
    return this.medHistoryService.findAll(+recordId);
  }

  @UseGuards(OwnerGuard)
  @Get(':historyId')
  findOne(@Param('historyId') historyId: string) {
    return this.medHistoryService.findOne(+historyId);
  }

  @UseGuards(OwnerGuard)
  @Patch(':historyId')
  update(
    @Param('historyId') historyId: string,
    @Body() updateMedHistoryDto: UpdateMedHistoryDto,
  ) {
    return this.medHistoryService.update(+historyId, updateMedHistoryDto);
  }

  @UseGuards(OwnerGuard)
  @Delete(':historyId')
  remove(@Param(':historyId') historyId: string) {
    return this.medHistoryService.remove(+historyId);
  }
}
