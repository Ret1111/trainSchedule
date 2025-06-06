import React from 'react';
import { Schedule } from '../types/schedule';

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="schedule-card">
          {/* Schedule card content */}
        </div>
      ))}
    </div>
  );
};

export default ScheduleList; 