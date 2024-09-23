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
import { TimeslotsService } from './timeslots.service';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';
import { Auth } from 'src/utils/decorators/Auth-decorator';
import { OwnerGuard } from 'src/auth/guards/owner-guard';
import { Public } from 'src/auth/public-decorator';

@Controller('doctors/:id/timeslots')
export class TimeslotsController {
  constructor(private readonly timeslotsService: TimeslotsService) {}

  @Auth('admin', 'doctor')
  @UseGuards(OwnerGuard)
  @Post()
  create(
    @Body() createTimeslotDto: CreateTimeslotDto,
    @Param('id') doctorId: string,
  ) {
    return this.timeslotsService.create(createTimeslotDto, +doctorId);
  }

  @Public()
  @Get()
  findAll(@Param('id') id: string) {
    return this.timeslotsService.findAll(+id);
  }

  @Public()
  @Get(':slotId')
  findOne(@Param('slotId') slotId: string) {
    return this.timeslotsService.findOne(+slotId);
  }

  @Auth('admin', 'doctor')
  @UseGuards(OwnerGuard)
  @Patch(':slotId')
  update(
    @Param('slotId') slotId: string,
    @Body() updateTimeslotDto: UpdateTimeslotDto,
  ) {
    return this.timeslotsService.update(+slotId, updateTimeslotDto);
  }

  @Auth('admin', 'doctor')
  @UseGuards(OwnerGuard)
  @Delete(':slotId')
  remove(@Param('slotId') slotId: string) {
    return this.timeslotsService.remove(+slotId);
  }
}
