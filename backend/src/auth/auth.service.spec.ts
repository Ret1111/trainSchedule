import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user', async () => {
      const hashedPassword = 'hashed_password';
      const expectedUser = {
        id: '1',
        ...createUserDto,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.register(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(expectedUser);
    });

    it('should throw error if user already exists', async () => {
      const existingUser = {
        id: '1',
        email: createUserDto.email,
        firstName: 'Existing',
        lastName: 'User',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.register(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'test123',
    };

    const mockUser = {
      id: '1',
      email: credentials.email,
      firstName: 'Test',
      lastName: 'User',
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should validate user with correct credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(credentials.email, credentials.password);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser(credentials.email, credentials.password))
        .rejects.toThrow(UnauthorizedException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw error if password is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser(credentials.email, credentials.password))
        .rejects.toThrow(UnauthorizedException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
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
    };

    it('should return access token and user data on successful login', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
      });
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });

    it('should throw error if validation fails', async () => {
      jest.spyOn(service, 'validateUser').mockRejectedValue(new UnauthorizedException());

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
}); 