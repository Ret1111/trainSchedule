export interface Schedule {
  id: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  platform: string;
  isActive: boolean;
} 