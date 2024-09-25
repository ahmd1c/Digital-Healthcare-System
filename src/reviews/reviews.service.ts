import { AppointmentsService } from './../appointments/appointments.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const hadAppointment = await this.appointmentsService.findAll({
      doc_id: createReviewDto.doc_id,
      patient_id: createReviewDto.patient_id,
    });
    if (!hadAppointment?.length) {
      throw new UnauthorizedException(
        'you did not have any appointments with this doctor',
      );
    }
    const review = this.reviewRepository.create(createReviewDto);
    const newReview = await this.reviewRepository.save(review);
    return {
      review: newReview,
      message: 'review created successfully',
    };
  }

  findAll(filter?: { doc_id?: number; patient_id?: number }) {
    const { doc_id, patient_id } = filter;
    return this.reviewRepository.find({
      where: {
        ...(patient_id ? { patient: { patient_id } } : {}),
        ...(doc_id ? { doctor: { doc_id } } : {}),
      },
    });
  }

  findOne(id: number) {
    return this.reviewRepository.findOne({ where: { id } });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number) {
    await this.reviewRepository.update(
      { id, patient: { patient_id: userId } },
      updateReviewDto,
    );
    return {
      message: 'review updated successfully',
    };
  }

  async remove(id: number, userId: number) {
    await this.reviewRepository.delete({
      id,
      patient: { patient_id: userId },
    });
    return {
      message: 'review deleted successfully',
    };
  }
}
