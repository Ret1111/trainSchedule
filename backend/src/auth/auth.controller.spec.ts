import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user', async () => {
      const expectedUser = {
        id: '1',
        ...registerDto,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        id: expectedUser.id,
        email: expectedUser.email,
        firstName: expectedUser.firstName,
        lastName: expectedUser.lastName,
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: expect.any(String),
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const existingUser = {
        id: '1',
        email: registerDto.email,
        firstName: 'Existing',
        lastName: 'User',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'test123',
    };

    const mockUser = {
      id: '1',
      email: loginDto.email,
      firstName: 'Test',
      lastName: 'User',
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    it('should login successfully and return token', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw error if credentials are invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(authService, 'validateUser').mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
}); 