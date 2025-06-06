import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';

describe('SchedulesController', () => {
  let controller: SchedulesController;
  let service: SchedulesService;

  const mockScheduleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [
        SchedulesService,
        {
          provide: getRepositoryToken(Schedule),
          useValue: mockScheduleRepository,
        },
      ],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const result = await controller.create(createScheduleDto);

      expect(result).toEqual(expectedSchedule);
      expect(mockScheduleRepository.create).toHaveBeenCalledWith(createScheduleDto);
      expect(mockScheduleRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of schedules', async () => {
      const expectedSchedules = [
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

      mockScheduleRepository.find.mockResolvedValue(expectedSchedules);

      const result = await controller.findAll();

      expect(result).toEqual(expectedSchedules);
      expect(mockScheduleRepository.find).toHaveBeenCalled();
    });

    it('should filter schedules by search term', async () => {
      const searchTerm = 'Moscow';
      const expectedSchedules = [
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

      mockScheduleRepository.find.mockResolvedValue(expectedSchedules);

      const result = await controller.findAll(searchTerm);

      expect(result).toEqual(expectedSchedules);
      expect(mockScheduleRepository.find).toHaveBeenCalledWith({
        where: [
          { trainNumber: expect.any(Object) },
          { departureStation: expect.any(Object) },
          { arrivalStation: expect.any(Object) },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a schedule by id', async () => {
      const scheduleId = '1';
      const expectedSchedule = {
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

      mockScheduleRepository.findOne.mockResolvedValue(expectedSchedule);

      const result = await controller.findOne(scheduleId);

      expect(result).toEqual(expectedSchedule);
      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({ where: { id: scheduleId } });
    });

    it('should throw error if schedule not found', async () => {
      const scheduleId = '999';
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(controller.findOne(scheduleId)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const scheduleId = '1';
    const updateScheduleDto = {
      trainNumber: 'TRN-002',
      platform: '2',
    };

    it('should update a schedule', async () => {
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

      const expectedSchedule = {
        ...existingSchedule,
        ...updateScheduleDto,
      };

      mockScheduleRepository.findOne.mockResolvedValue(existingSchedule);
      mockScheduleRepository.save.mockResolvedValue(expectedSchedule);

      const result = await controller.update(scheduleId, updateScheduleDto);

      expect(result).toEqual(expectedSchedule);
      expect(mockScheduleRepository.save).toHaveBeenCalledWith(expectedSchedule);
    });

    it('should throw error if schedule not found', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(controller.update(scheduleId, updateScheduleDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete a schedule', async () => {
      const scheduleId = '1';
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

      mockScheduleRepository.findOne.mockResolvedValue(existingSchedule);
      mockScheduleRepository.remove.mockResolvedValue(existingSchedule);

      await controller.remove(scheduleId);

      expect(mockScheduleRepository.remove).toHaveBeenCalledWith(existingSchedule);
    });

    it('should throw error if schedule not found', async () => {
      const scheduleId = '999';
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(controller.remove(scheduleId)).rejects.toThrow();
    });
  });
}); 