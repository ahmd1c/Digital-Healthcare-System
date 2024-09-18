import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PickType(
  PartialType(CreateAppointmentDto),
  ['type', 'date', 'timeslot_id'],
) {}
