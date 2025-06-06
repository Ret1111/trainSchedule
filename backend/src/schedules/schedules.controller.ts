import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('schedules')
@Controller('schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new schedule' })
  @ApiResponse({ status: 201, description: 'Schedule successfully created' })
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schedules' })
  @ApiResponse({ status: 200, description: 'Return all schedules' })
  findAll(@Query('search') search?: string) {
    return this.schedulesService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific schedule' })
  @ApiResponse({ status: 200, description: 'Return the schedule' })
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a schedule' })
  @ApiResponse({ status: 200, description: 'Schedule successfully updated' })
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiResponse({ status: 200, description: 'Schedule successfully deleted' })
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
} 