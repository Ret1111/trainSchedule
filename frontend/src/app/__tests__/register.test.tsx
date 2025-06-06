import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../register/page';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockRouter = useRouter();

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders register form', () => {
    render(<Register />);
    
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    mockedAxios.post.mockResolvedValueOnce({});

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error when passwords do not match', async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'differentpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('handles registration error', async () => {
    const errorMessage = 'Email already exists';
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows loading state during registration', async () => {
    mockedAxios.post.mockImplementationOnce(() => new Promise(() => {}));

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText('Creating account...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
  });
}); 