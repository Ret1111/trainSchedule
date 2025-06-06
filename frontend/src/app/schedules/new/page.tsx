'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { FiMapPin, FiClock, FiHash, FiToggleRight, FiSave, FiX } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

export default function NewSchedulePage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [schedule, setSchedule] = useState({
    trainNumber: '',
    departureStation: '',
    arrivalStation: '',
    departureTime: '',
    arrivalTime: '',
    platform: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSchedule((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/schedules', schedule);
      router.push('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          router.push('/login');
          return;
        }
        if (err.response?.data?.message) {
          setError(err.response.data.message);
          return;
        }
      }
      setError('Failed to create schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">New Schedule</h1>
            <p className="mt-2 text-slate-600">Create a new train schedule</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="btn-outline flex items-center gap-2"
          >
            <FiX className="h-5 w-5" />
            Cancel
          </button>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="trainNumber" className="label">
                Train Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHash className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="trainNumber"
                  name="trainNumber"
                  type="text"
                  required
                  value={schedule.trainNumber}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Enter train number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="departureStation" className="label">
                  Departure Station
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="departureStation"
                    name="departureStation"
                    type="text"
                    required
                    value={schedule.departureStation}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="From"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="arrivalStation" className="label">
                  Arrival Station
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="arrivalStation"
                    name="arrivalStation"
                    type="text"
                    required
                    value={schedule.arrivalStation}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="departureTime" className="label">
                  Departure Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="departureTime"
                    name="departureTime"
                    type="datetime-local"
                    required
                    value={schedule.departureTime}
                    onChange={handleChange}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="arrivalTime" className="label">
                  Arrival Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="arrivalTime"
                    name="arrivalTime"
                    type="datetime-local"
                    required
                    value={schedule.arrivalTime}
                    onChange={handleChange}
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="platform" className="label">
                  Platform
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHash className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="platform"
                    name="platform"
                    type="text"
                    required
                    value={schedule.platform}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Enter platform number"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-8">
                <div className="relative inline-flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={schedule.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-slate-900">
                    Active Schedule
                  </label>
                  <FiToggleRight className="ml-2 h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="loading-spinner" />
                ) : (
                  <>
                    <FiSave className="h-5 w-5" />
                    Create Schedule
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 