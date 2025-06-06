import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../login/page';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockRouter = useRouter();

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockToken = 'mock-token';
    mockedAxios.post.mockResolvedValueOnce({ data: { access_token: mockToken } });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('handles login error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('shows loading state during login', async () => {
    mockedAxios.post.mockImplementationOnce(() => new Promise(() => {}));

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });
}); 