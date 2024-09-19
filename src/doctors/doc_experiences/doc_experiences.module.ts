import { Module } from '@nestjs/common';
import { DocExperiencesService } from './doc_experiences.service';
import { DocExperiencesController } from './doc_experiences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocExperience } from './entities/doc_experience.entity';
import { OwnerGuard } from 'src/auth/guards/owner-guard';

@Module({
  imports: [TypeOrmModule.forFeature([DocExperience])],
  controllers: [DocExperiencesController],
  providers: [DocExperiencesService, OwnerGuard],
})
export class DocExperiencesModule {}
