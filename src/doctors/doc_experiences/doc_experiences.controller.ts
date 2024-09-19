import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DocExperiencesService } from './doc_experiences.service';
import { CreateDocExperienceDto } from './dto/create-doc_experience.dto';
import { UpdateDocExperienceDto } from './dto/update-doc_experience.dto';
import { OwnerGuard } from 'src/auth/guards/owner-guard';
import { Auth } from 'src/utils/decorators/Auth-decorator';
import { Public } from 'src/auth/public-decorator';

@UseGuards(OwnerGuard)
@Controller('doctors/:id/doc-exprs')
export class DocExperiencesController {
  constructor(private readonly docExperiencesService: DocExperiencesService) {}

  @Auth('admin', 'doctor')
  @UseGuards(OwnerGuard)
  @Post()
  create(@Body() createDocExperienceDto: CreateDocExperienceDto) {
    return this.docExperiencesService.create(createDocExperienceDto);
  }

  @Get()
  findAll(@Param('id', ParseIntPipe) docId: number) {
    return this.docExperiencesService.findAll(docId);
  }

  @Public()
  @Get(':exprId')
  findOne(@Param('exprId') id: string) {
    return this.docExperiencesService.findOne(+id);
  }

  @Auth('admin', 'doctor')
  @UseGuards(OwnerGuard)
  @Patch(':exprId')
  update(
    @Param('exprId') id: string,
    @Body() updateDocExperienceDto: UpdateDocExperienceDto,
  ) {
    return this.docExperiencesService.update(+id, updateDocExperienceDto);
  }

  @Auth('admin', 'doctor')
  @UseGuards(OwnerGuard)
  @Delete(':exprId')
  remove(@Param('exprId') id: string) {
    return this.docExperiencesService.remove(+id);
  }
}
