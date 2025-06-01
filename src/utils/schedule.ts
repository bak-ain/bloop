import { ScheduleEvent, ScheduleDay } from '../types/index';

export function generateMonthlyScheduleDays(
  year: number,
  month: number,
  events: ScheduleEvent[]
): ScheduleDay[] {
  // month는 1-based (즉 5 → 5월)
  const daysInMonth = new Date(year, month, 0).getDate(); // 말일 계산
  const monthStr = String(month).padStart(2, '0');

  const result: ScheduleDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const fullDate = `${year}-${monthStr}-${dayStr}`;

    const matchedEvents = events.filter(e => e.date === fullDate);

    result.push({
      date: fullDate,
      events: matchedEvents
    });
  }

  return result;
}
