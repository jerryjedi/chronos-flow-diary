
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameDay, parseISO } from 'date-fns';
import { Event, Task } from '../data/mockData';

// Get all days in a month for the calendar grid
export const getCalendarDays = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  // Get days in month
  const daysInMonth = eachDayOfInterval({ start, end });
  
  // Get days to fill beginning of calendar grid (from previous month)
  const startDay = start.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const prevDays = Array.from({ length: startDay }, (_, i) => 
    addDays(start, -(startDay - i))
  );
  
  // Get days to fill end of calendar grid (from next month)
  const lastDay = end.getDay();
  const nextDays = Array.from({ length: 6 - lastDay }, (_, i) => 
    addDays(end, i + 1)
  );
  
  // Combine all days
  return [...prevDays, ...daysInMonth, ...nextDays];
};

// Get events for a specific day
export const getEventsForDay = (events: Event[], date: Date): Event[] => {
  return events.filter(event => isSameDay(parseISO(event.date), date));
};

// Get tasks for a specific day
export const getTasksForDay = (tasks: Task[], date: Date): Task[] => {
  return tasks.filter(task => isSameDay(parseISO(task.date), date));
};

// Parse and process .ics file content
export const parseICSFile = (content: string): Event[] => {
  const events: Event[] = [];
  const lines = content.split(/\r\n|\n|\r/);
  
  let currentEvent: Partial<Event> = {};
  let isEvent = false;
  
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      isEvent = true;
      currentEvent = { id: crypto.randomUUID() };
    } else if (line === 'END:VEVENT') {
      isEvent = false;
      if (currentEvent.title && currentEvent.date) {
        events.push(currentEvent as Event);
      }
    } else if (isEvent) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':');
      
      if (key.startsWith('SUMMARY')) {
        currentEvent.title = value;
      } else if (key.startsWith('DTSTART')) {
        // Basic parsing - in a real app, would need more robust date parsing
        if (value.length >= 8) {
          const year = value.substring(0, 4);
          const month = value.substring(4, 6);
          const day = value.substring(6, 8);
          currentEvent.date = `${year}-${month}-${day}`;
          
          if (value.includes('T') && value.length >= 13) {
            const hour = value.substring(9, 11);
            const minute = value.substring(11, 13);
            currentEvent.startTime = `${hour}:${minute}`;
          }
        }
      } else if (key.startsWith('DTEND')) {
        if (value.includes('T') && value.length >= 13) {
          const hour = value.substring(9, 11);
          const minute = value.substring(11, 13);
          currentEvent.endTime = `${hour}:${minute}`;
        }
      } else if (key.startsWith('DESCRIPTION')) {
        // Clean up HTML tags from description
        const cleanDescription = value
          .replace(/<[^>]*>?/gm, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
          .replace(/&lt;/g, '<') // Replace &lt; with <
          .replace(/&gt;/g, '>') // Replace &gt; with >
          .replace(/&quot;/g, '"') // Replace &quot; with "
          .replace(/&amp;/g, '&'); // Replace &amp; with &
        
        currentEvent.description = cleanDescription;
      }
    }
  }
  
  return events;
};
