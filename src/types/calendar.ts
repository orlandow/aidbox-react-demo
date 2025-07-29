export interface TimeSlot {
  hour: number;
  minute: number;
  timeString: string;
}

export interface WeekDay {
  date: Date;
  dateString: string;
  isToday: boolean;
  dayName: string;
}