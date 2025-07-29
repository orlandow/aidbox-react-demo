import type { WeekDay } from '../types/calendar';

export function getWeekDays(currentDate: Date): WeekDay[] {
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day; // First day is Sunday
  startOfWeek.setDate(diff);
  
  const days: WeekDay[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    days.push({
      date,
      dateString: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      isToday: date.toDateString() === today.toDateString(),
      dayName: dayNames[date.getDay()],
    });
  }
  
  return days;
}
