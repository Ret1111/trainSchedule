import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
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
      mockAuthService.validateUser.mockResolvedValue(mockUser);

      const result = await strategy.validate(credentials.email, credentials.password);

      expect(result).toEqual(mockUser);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        credentials.email,
        credentials.password,
      );
    });

    it('should throw error if user validation fails', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate(credentials.email, credentials.password))
        .rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        credentials.email,
        credentials.password,
      );
    });
  });
}); 