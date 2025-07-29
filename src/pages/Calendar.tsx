import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import CalendarGrid from '../components/calendar/CalendarGrid';
import AppointmentForm from '../components/calendar/AppointmentForm';
import AppointmentDetail from '../components/calendar/AppointmentDetail';
import { useWeekAppointmentsWithEncounters } from '../hooks/api';
import { getWeekDays } from '../utils/calendar';
import type { WeekDay, TimeSlot } from '../types/calendar';
import type { Appointment } from '../types/fhir/Appointment';

// Local helper functions
function getLocalDayStart(date: Date): string {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay.toISOString();
}

function getLocalDayEnd(date: Date): string {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.toISOString();
}

function getPreviousWeek(currentDate: Date): Date {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() - 7);
  return newDate;
}

function getNextWeek(currentDate: Date): Date {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + 7);
  return newDate;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Get the week range for API query
  const weekDays = getWeekDays(currentDate);
  const startDate = getLocalDayStart(weekDays[0].date);  // Start of Sunday in local time, converted to UTC
  const endDate = getLocalDayEnd(weekDays[6].date);      // End of Saturday in local time, converted to UTC
  
  const { data: calendarData, isLoading, error } = useWeekAppointmentsWithEncounters(startDate, endDate);
  const appointments = calendarData?.appointments || [];
  const allEncounters = calendarData?.encounters || [];

  const handlePreviousWeek = () => {
    setCurrentDate(getPreviousWeek(currentDate));
  };

  const handleNextWeek = () => {
    setCurrentDate(getNextWeek(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSlotClick = (day: WeekDay, timeSlot: TimeSlot) => {
    setSelectedDay(day);
    setSelectedTimeSlot(timeSlot);
    setShowAppointmentForm(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetail(true);
  };

  const handleCloseAppointmentForm = () => {
    setShowAppointmentForm(false);
    setSelectedDay(null);
    setSelectedTimeSlot(null);
  };

  const handleCloseAppointmentDetail = () => {
    setShowAppointmentDetail(false);
    setSelectedAppointment(null);
  };

  const getWeekRangeText = () => {
    const startMonth = weekDays[0].date.toLocaleDateString('en-US', { month: 'long' });
    const startDay = weekDays[0].date.getDate();
    const endMonth = weekDays[6].date.toLocaleDateString('en-US', { month: 'long' });
    const endDay = weekDays[6].date.getDate();
    const year = weekDays[0].date.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  // Note: We don't block the calendar on appointment loading errors
  // The calendar should always show, even if appointments can't be loaded

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-2">{getWeekRangeText()}</p>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleToday}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Today
            </button>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePreviousWeek}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleNextWeek}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {isLoading && !error ? (
        <div className="bg-white shadow rounded-lg p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading appointments...</div>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="text-yellow-800 text-sm">
                Note: Could not load appointments, showing empty calendar
              </div>
            </div>
          )}
          <CalendarGrid
            currentDate={currentDate}
            appointments={appointments}
            encounters={allEncounters}
            onSlotClick={handleSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        </>
      )}

      {/* Modals */}
      <AppointmentForm
        isOpen={showAppointmentForm}
        onClose={handleCloseAppointmentForm}
        selectedDay={selectedDay}
        selectedTimeSlot={selectedTimeSlot}
      />

      <AppointmentDetail
        isOpen={showAppointmentDetail}
        onClose={handleCloseAppointmentDetail}
        appointment={selectedAppointment}
      />
    </div>
  );
}