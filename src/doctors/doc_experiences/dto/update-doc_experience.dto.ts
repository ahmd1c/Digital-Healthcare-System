import { PartialType } from '@nestjs/mapped-types';
import { CreateDocExperienceDto } from './create-doc_experience.dto';

export class UpdateDocExperienceDto extends PartialType(CreateDocExperienceDto) {}
