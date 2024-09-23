import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateTimeslotDto {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'time must be in the format HH:MM',
  })
  start_time: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'time must be in the format HH:MM',
  })
  end_time: string;

  @IsNotEmpty()
  @IsIn(['single', 'recurrent', 'unavailable'])
  type: string;

  @ValidateIf((o) => o.type === 'recurrent')
  @Min(1, { each: true })
  @Max(7, { each: true })
  days: number[];

  @ValidateIf((o) => o.type === 'single' || o.type === 'unavailable')
  @IsDateString()
  date: Date;
}
