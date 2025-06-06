import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockRouter = useRouter();

describe('Home Page', () => {
  const mockSchedules = [
    {
      id: 1,
      trainNumber: 'TRN-001',
      departureStation: 'Station A',
      arrivalStation: 'Station B',
      departureTime: '2024-01-01T10:00:00',
      arrivalTime: '2024-01-01T12:00:00',
      platform: '1',
      isActive: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem = jest.fn().mockReturnValue('mock-token');
  });

  it('redirects to login if no token', () => {
    localStorage.getItem = jest.fn().mockReturnValue(null);
    render(<Home />);
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('renders schedule table with data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockSchedules });
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Check if data is rendered
    expect(screen.getByText('TRN-001')).toBeInTheDocument();
    expect(screen.getByText(/Station A/)).toBeInTheDocument();
    expect(screen.getByText(/Station B/)).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockSchedules });
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search schedules...');
    fireEvent.change(searchInput, { target: { value: 'TRN-001' } });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('?search=TRN-001'),
        expect.any(Object)
      );
    });
  });

  it('handles add schedule modal', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockSchedules });
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /add schedule/i }));

    // Fill form
    fireEvent.change(screen.getByLabelText(/train number/i), {
      target: { value: 'TRN-002' },
    });
    fireEvent.change(screen.getByLabelText(/departure station/i), {
      target: { value: 'Station C' },
    });
    fireEvent.change(screen.getByLabelText(/arrival station/i), {
      target: { value: 'Station D' },
    });
    fireEvent.change(screen.getByLabelText(/platform/i), {
      target: { value: '2' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /add schedule/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  it('handles logout', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockSchedules });
    render(<Home />);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('shows loading state', () => {
    mockedAxios.get.mockImplementationOnce(() => new Promise(() => {}));
    render(<Home />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
}); 