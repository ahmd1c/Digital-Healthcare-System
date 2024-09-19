import { PartialType } from '@nestjs/mapped-types';
import { CreateMedRecordDto } from './create-med-record.dto';

export class UpdateMedRecordDto extends PartialType(CreateMedRecordDto) {}
