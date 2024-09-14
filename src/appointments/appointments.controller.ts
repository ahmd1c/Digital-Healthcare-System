import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmenParamtDto } from './dto/queryParam-appointment.dto';
import User from 'src/utils/decorators/USER.decorator';
import { Auth } from 'src/utils/decorators/Auth-decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Query() appointmentParam: AppointmenParamtDto, @User() user) {
    return this.appointmentsService.findAll(appointmentParam, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user) {
    return this.appointmentsService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @User() user,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto, user);
  }

  @Auth('admin', 'doctor')
  @Patch(':id/confirm')
  confirm(@Param('id') id: string, @User() user) {
    return this.appointmentsService.confirm(+id, user);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @User() user) {
    return this.appointmentsService.cancel(+id, user);
  }
}
