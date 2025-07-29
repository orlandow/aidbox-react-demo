import { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { getWeekDays } from '../../utils/calendar';
import type { WeekDay, TimeSlot } from '../../types/calendar';
import type { Appointment } from '../../types/fhir/Appointment';
import type { Encounter } from '../../types/fhir/Encounter';

// Calendar configuration constants
const WORK_START_HOUR = 8;
const WORK_END_HOUR = 18;
const SLOT_DURATION_MINUTES = 30;

interface CalendarGridProps {
  currentDate: Date;
  appointments: Appointment[];
  encounters: Encounter[];
  onSlotClick: (day: WeekDay, timeSlot: TimeSlot) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

interface AppointmentBlockProps {
  appointment: Appointment;
  encounters: Encounter[];
  onClick: () => void;
}

function AppointmentBlock({ appointment, encounters, onClick }: AppointmentBlockProps) {
  const getTypeColor = (appointment: Appointment) => {
    const code = appointment.appointmentType?.coding?.[0]?.code || '';
    const display = appointment.appointmentType?.text || 
                   appointment.appointmentType?.coding?.[0]?.display || 
                   '';
    
    // Check FHIR codes first, then fallback to display text matching
    switch (code.toUpperCase()) {
      case 'EMERGENCY':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'CHECKUP':
      case 'ROUTINE':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'FOLLOWUP':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'WALKIN':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        // Fallback to display text matching for backwards compatibility
        switch (display.toLowerCase()) {
          case 'emergency':
          case 'emergency appointment':
            return 'bg-red-100 border-red-300 text-red-800';
          case 'checkup':
          case 'routine':
          case 'routine appointment':
          case 'routine appointment - default if not valued':
            return 'bg-blue-100 border-blue-300 text-blue-800';
          case 'consultation':
            return 'bg-purple-100 border-purple-300 text-purple-800';
          case 'follow-up':
          case 'followup':
          case 'follow up visit from a previous appointment':
          case 'a follow up visit from a previous appointment':
            return 'bg-green-100 border-green-300 text-green-800';
          case 'walk-in':
          case 'walkin':
          case 'a previously unscheduled walk-in visit':
            return 'bg-yellow-100 border-yellow-300 text-yellow-800';
          case 'surgery':
          case 'procedure':
            return 'bg-orange-100 border-orange-300 text-orange-800';
          case 'therapy':
            return 'bg-teal-100 border-teal-300 text-teal-800';
          default:
            return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    }
  };

  const getPatientName = () => {
    const patientParticipant = appointment.participant?.find(
      p => p.actor?.reference?.startsWith('Patient/')
    );
    return patientParticipant?.actor?.display || 'Unknown Patient';
  };

  const getAppointmentType = () => {
    return appointment.appointmentType?.text || 
           appointment.appointmentType?.coding?.[0]?.display || 
           'Appointment';
  };

  const getEncounterForAppointment = () => {
    return encounters.find(encounter => 
      encounter.appointment?.some(ref => 
        ref.reference === `Appointment/${appointment.id}`
      )
    );
  };

  const encounter = getEncounterForAppointment();
  const hasActiveEncounter = encounter && encounter.status === 'in-progress';
  const hasCompletedEncounter = encounter && encounter.status === 'finished';

  return (
    <div
      className={`p-2 rounded cursor-pointer border text-xs ${getTypeColor(appointment)} hover:opacity-80 transition-opacity relative`}
      onClick={onClick}
    >
      <div className="font-medium truncate">{getPatientName()}</div>
      <div className="text-xs opacity-75 truncate">{getAppointmentType()}</div>
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-75 capitalize">{appointment.status}</div>
        {hasActiveEncounter && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Active encounter"></div>
          </div>
        )}
        {hasCompletedEncounter && (
          <div className="flex items-center">
            <CheckIcon className="w-4 h-4 text-green-600 font-bold" title="Completed encounter" />
          </div>
        )}
      </div>
    </div>
  );
}

// Local helper function for current time positioning
function getCurrentTimePosition(): { isVisible: boolean; topOffset: number; currentTime: string } {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Check if current time is within work hours
  if (currentHour < WORK_START_HOUR || currentHour > WORK_END_HOUR) {
    return { isVisible: false, topOffset: 0, currentTime: '' };
  }
  
  // Calculate position within the grid
  const hoursSinceStart = currentHour - WORK_START_HOUR;
  const minutesSinceStart = currentMinute;
  
  // Each hour has 60 pixels (min-h-[60px]), each minute is 1 pixel
  const headerHeight = 73; // Approximate height of the header
  const slotHeight = 60; // Each 30-minute slot is 60px
  
  // Calculate total minutes since start of work day
  const totalMinutes = (hoursSinceStart * 60) + minutesSinceStart;
  
  // Convert to pixels (each 30-minute slot = 60px, so each minute = 2px)
  const pixelsPerMinute = slotHeight / SLOT_DURATION_MINUTES;
  const topOffset = headerHeight + (totalMinutes * pixelsPerMinute);
  
  const currentTimeDate = new Date();
  currentTimeDate.setHours(currentHour, currentMinute, 0, 0);
  const currentTime = currentTimeDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  
  return { isVisible: true, topOffset, currentTime };
}

// Local helper functions for calendar grid
function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  for (let hour = WORK_START_HOUR; hour <= WORK_END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_DURATION_MINUTES) {
      if (hour === WORK_END_HOUR && minute > 0) break;
      
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      const timeString = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      slots.push({ hour, minute, timeString });
    }
  }
  
  return slots;
}

function getSlotId(dayIndex: number, hour: number, minute: number): string {
  return `slot-${dayIndex}-${hour}-${minute}`;
}

export default function CalendarGrid({ currentDate, appointments, encounters, onSlotClick, onAppointmentClick }: CalendarGridProps) {
  const weekDays = getWeekDays(currentDate);
  const timeSlots = generateTimeSlots();
  const [currentTimePos, setCurrentTimePos] = useState(getCurrentTimePosition());

  // Find today's column index
  const todayColumnIndex = weekDays.findIndex(day => day.isToday);
  const showTimeIndicator = todayColumnIndex !== -1;

  // Update current time position every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTimePos(getCurrentTimePosition());
    };

    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getAppointmentForSlot = (day: WeekDay, timeSlot: TimeSlot): Appointment | null => {
    return appointments.find(apt => {
      if (!apt.start) return false;
      
      const aptDate = new Date(apt.start);
      const aptDay = aptDate.toDateString();
      const dayString = day.date.toDateString();
      
      if (aptDay !== dayString) return false;
      
      const aptHour = aptDate.getHours();
      const aptMinute = aptDate.getMinutes();
      
      return aptHour === timeSlot.hour && aptMinute === timeSlot.minute;
    }) || null;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden relative">
      {/* Header with days */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-4 bg-gray-50 border-r border-gray-200">
          <span className="text-sm font-medium text-gray-500">Time</span>
        </div>
        {weekDays.map((day, index) => {
          const isWeekend = day.dayName === 'Sun' || day.dayName === 'Sat';
          return (
            <div key={index} className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${isWeekend ? 'bg-blue-50' : 'bg-white'}`}>
              <div className="text-sm font-medium text-gray-900">{day.dayName}</div>
              <div className={`text-lg font-semibold ${day.isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {day.dateString}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time slots grid */}
      <div className="divide-y divide-gray-200">
        {timeSlots.map((timeSlot, timeIndex) => (
          <div key={timeIndex} className="grid grid-cols-8 min-h-[60px]">
            {/* Time label */}
            <div className="p-3 bg-gray-50 border-r border-gray-200 flex items-center">
              <span className="text-sm text-gray-600">{timeSlot.timeString}</span>
            </div>
            
            {/* Day slots */}
            {weekDays.map((day, dayIndex) => {
              const appointment = getAppointmentForSlot(day, timeSlot);
              const slotId = getSlotId(dayIndex, timeSlot.hour, timeSlot.minute);
              const isWeekend = day.dayName === 'Sun' || day.dayName === 'Sat';
              
              return (
                <div
                  key={dayIndex}
                  id={slotId}
                  className={`border-r border-gray-200 last:border-r-0 p-1 min-h-[60px] relative ${isWeekend ? 'bg-blue-50' : 'bg-white'}`}
                >
                  {appointment ? (
                    <AppointmentBlock
                      appointment={appointment}
                      encounters={encounters}
                      onClick={() => onAppointmentClick(appointment)}
                    />
                  ) : (
                    <button
                      className="w-full h-full hover:bg-gray-50 rounded transition-colors flex items-center justify-center text-gray-400 hover:text-gray-600"
                      onClick={() => onSlotClick(day, timeSlot)}
                    >
                      <span className="text-xs">+</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Current time indicator - only show on today's column */}
      {currentTimePos.isVisible && showTimeIndicator && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{ 
            top: `${currentTimePos.topOffset}px`,
            left: `${(todayColumnIndex + 1) * (100 / 8)}%`, // Position at today's column (skip time column)
            width: `${100 / 8}%` // Width of one column
          }}
        >
          {/* Red line only in today's column */}
          <div className="w-full h-0.5 bg-red-500" />
          {/* Red dot on the left edge of today's column */}
          <div className="absolute left-0 w-3 h-3 bg-red-500 rounded-full transform -translate-y-1/2 -translate-x-1/2" />
        </div>
      )}
      
      {/* Time label positioned over the time column */}
      {currentTimePos.isVisible && showTimeIndicator && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{ 
            top: `${currentTimePos.topOffset}px`,
            left: '0',
            width: `${100 / 8}%` // Width of time column
          }}
        >
          <div className="absolute right-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded transform -translate-y-1/2">
            {currentTimePos.currentTime}
          </div>
        </div>
      )}
    </div>
  );
}