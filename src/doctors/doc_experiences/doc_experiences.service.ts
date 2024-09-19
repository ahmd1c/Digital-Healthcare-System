import { Injectable } from '@nestjs/common';
import { CreateDocExperienceDto } from './dto/create-doc_experience.dto';
import { UpdateDocExperienceDto } from './dto/update-doc_experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocExperience } from './entities/doc_experience.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocExperiencesService {
  constructor(
    @InjectRepository(DocExperience)
    private docExperienceRepository: Repository<DocExperience>,
  ) {}

  create(experienceDto: CreateDocExperienceDto) {
    const experience = this.docExperienceRepository.create(experienceDto);
    return this.docExperienceRepository.save(experience);
  }

  findAll(docId: number) {
    return this.docExperienceRepository.find({
      where: { doc: { doc_id: docId } },
    });
  }

  findOne(id: number) {
    return this.docExperienceRepository.findOne({ where: { id } });
  }

  update(id: number, updateDocExperienceDto: UpdateDocExperienceDto) {
    return this.docExperienceRepository.update(id, updateDocExperienceDto);
  }

  remove(id: number) {
    return this.docExperienceRepository.delete(id);
  }
}
