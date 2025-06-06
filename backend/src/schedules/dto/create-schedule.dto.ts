import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty()
  @IsString()
  trainNumber: string;

  @ApiProperty()
  @IsString()
  departureStation: string;

  @ApiProperty()
  @IsString()
  arrivalStation: string;

  @ApiProperty()
  @IsDateString()
  departureTime: Date;

  @ApiProperty()
  @IsDateString()
  arrivalTime: Date;

  @ApiProperty()
  @IsString()
  platform: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 