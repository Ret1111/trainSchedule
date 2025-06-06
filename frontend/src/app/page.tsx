'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiClock, FiMapPin } from 'react-icons/fi';
import { format } from 'date-fns';
import { Schedule } from '@/types/schedule';
import ScheduleList from '@/components/ScheduleList';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

interface Schedule {
  id: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  platform: string;
  isActive: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchSchedules();
  }, [isAuthenticated, token, router]);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/schedules', {
        params: searchTerm ? { search: searchTerm } : undefined,
      });
      setSchedules(response.data);
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login');
        return;
      }
      setError('Failed to fetch schedules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await api.delete(`/schedules/${id}`);
      setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login');
        return;
      }
      setError('Failed to delete schedule');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    fetchSchedules();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Train Schedules</h1>
            <p className="mt-2 text-slate-600">Manage and view all train schedules</p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => router.push('/schedules/new')}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus className="h-5 w-5" />
              Add Schedule
            </button>
          </div>
        </div>

        <div className="card mb-8">
          <form onSubmit={handleSearch} className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by train number, station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-secondary ml-4">
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner" />
          </div>
        ) : schedules.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-600">No schedules found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="schedule-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Train {schedule.trainNumber}
                    </h3>
                    <span className={schedule.isActive ? 'status-active' : 'status-inactive'}>
                      {schedule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="schedule-platform">
                    Platform {schedule.platform}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="schedule-station">From</div>
                      <div className="font-medium">{schedule.departureStation}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiMapPin className="h-5 w-5 text-secondary mt-1" />
                    <div>
                      <div className="schedule-station">To</div>
                      <div className="font-medium">{schedule.arrivalStation}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiClock className="h-5 w-5 text-slate-400 mt-1" />
                    <div>
                      <div className="schedule-time">
                        {format(new Date(schedule.departureTime), 'HH:mm')}
                        {' - '}
                        {format(new Date(schedule.arrivalTime), 'HH:mm')}
                      </div>
                      <div className="schedule-station">
                        {format(new Date(schedule.departureTime), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => router.push(`/schedules/${schedule.id}/edit`)}
                    className="btn-outline p-2"
                    title="Edit"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="btn p-2 bg-red-100 text-red-600 hover:bg-red-200"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 