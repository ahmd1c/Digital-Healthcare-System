import { PartialType } from '@nestjs/mapped-types';
import { CreateMedHistoryDto } from './create-med_history.dto';

export class UpdateMedHistoryDto extends PartialType(CreateMedHistoryDto) {}
