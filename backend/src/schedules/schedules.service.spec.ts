import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { NotFoundException } from '@nestjs/common';
import { Like } from 'typeorm';

describe('SchedulesService', () => {
  let service: SchedulesService;

  const mockScheduleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: getRepositoryToken(Schedule),
          useValue: mockScheduleRepository,
        },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createScheduleDto = {
      trainNumber: 'TRN-001',
      departureStation: 'Moscow',
      arrivalStation: 'Saint Petersburg',
      departureTime: new Date('2024-04-05T10:00:00Z'),
      arrivalTime: new Date('2024-04-05T14:00:00Z'),
      platform: '1',
      isActive: true,
    };

    it('should create a new schedule', async () => {
      const expectedSchedule = {
        id: '1',
        ...createScheduleDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockScheduleRepository.create.mockReturnValue(expectedSchedule);
      mockScheduleRepository.save.mockResolvedValue(expectedSchedule);

      const result = await service.create(createScheduleDto);

      expect(result).toEqual(expectedSchedule);
      expect(mockScheduleRepository.create).toHaveBeenCalledWith(createScheduleDto);
      expect(mockScheduleRepository.save).toHaveBeenCalledWith(expectedSchedule);
    });
  });

  describe('findAll', () => {
    const mockSchedules = [
      {
        id: '1',
        trainNumber: 'TRN-001',
        departureStation: 'Moscow',
        arrivalStation: 'Saint Petersburg',
        departureTime: new Date('2024-04-05T10:00:00Z'),
        arrivalTime: new Date('2024-04-05T14:00:00Z'),
        platform: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all schedules without search term', async () => {
      mockScheduleRepository.find.mockResolvedValue(mockSchedules);

      const result = await service.findAll();

      expect(result).toEqual(mockSchedules);
      expect(mockScheduleRepository.find).toHaveBeenCalled();
    });

    it('should return filtered schedules with search term', async () => {
      const searchTerm = 'Moscow';
      mockScheduleRepository.find.mockResolvedValue(mockSchedules);

      const result = await service.findAll(searchTerm);

      expect(result).toEqual(mockSchedules);
      expect(mockScheduleRepository.find).toHaveBeenCalledWith({
        where: [
          { trainNumber: Like(`%${searchTerm}%`) },
          { departureStation: Like(`%${searchTerm}%`) },
          { arrivalStation: Like(`%${searchTerm}%`) },
        ],
      });
    });
  });

  describe('findOne', () => {
    const scheduleId = '1';
    const mockSchedule = {
      id: scheduleId,
      trainNumber: 'TRN-001',
      departureStation: 'Moscow',
      arrivalStation: 'Saint Petersburg',
      departureTime: new Date('2024-04-05T10:00:00Z'),
      arrivalTime: new Date('2024-04-05T14:00:00Z'),
      platform: '1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return a schedule by id', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);

      const result = await service.findOne(scheduleId);

      expect(result).toEqual(mockSchedule);
      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: scheduleId },
      });
    });

    it('should throw error if schedule not found', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(scheduleId)).rejects.toThrow(NotFoundException);
      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: scheduleId },
      });
    });
  });

  describe('update', () => {
    const scheduleId = '1';
    const updateScheduleDto = {
      trainNumber: 'TRN-002',
      platform: '2',
    };

    const existingSchedule = {
      id: scheduleId,
      trainNumber: 'TRN-001',
      departureStation: 'Moscow',
      arrivalStation: 'Saint Petersburg',
      departureTime: new Date('2024-04-05T10:00:00Z'),
      arrivalTime: new Date('2024-04-05T14:00:00Z'),
      platform: '1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSchedule = {
      ...existingSchedule,
      ...updateScheduleDto,
    };

    it('should update a schedule', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(existingSchedule);
      mockScheduleRepository.save.mockResolvedValue(updatedSchedule);

      const result = await service.update(scheduleId, updateScheduleDto);

      expect(result).toEqual(updatedSchedule);
      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: scheduleId },
      });
      expect(mockScheduleRepository.save).toHaveBeenCalledWith(updatedSchedule);
    });

    it('should throw error if schedule not found', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(service.update(scheduleId, updateScheduleDto)).rejects.toThrow(NotFoundException);
      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: scheduleId },
      });
      expect(mockScheduleRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const scheduleId = '1';
    const mockSchedule = {
      id: scheduleId,
      trainNumber: 'TRN-001',
      departureStation: 'Moscow',
      arrivalStation: 'Saint Petersburg',
      departureTime: new Date('2024-04-05T10:00:00Z'),
      arrivalTime: new Date('2024-04-05T14:00:00Z'),
      platform: '1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should remove a schedule', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);
      mockScheduleRepository.remove.mockResolvedValue(mockSchedule);

      await service.remove(scheduleId);

      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: scheduleId },
      });
      expect(mockScheduleRepository.remove).toHaveBeenCalledWith(mockSchedule);
    });

    it('should throw error if schedule not found', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(scheduleId)).rejects.toThrow(NotFoundException);
      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: scheduleId },
      });
      expect(mockScheduleRepository.remove).not.toHaveBeenCalled();
    });
  });
}); 