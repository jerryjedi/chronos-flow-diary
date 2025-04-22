
export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string
  startTime?: string; // 24h format HH:MM
  endTime?: string; // 24h format HH:MM
  description?: string;
  category?: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  date: string; // ISO date string
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  description?: string;
}

export type Category = {
  id: string;
  name: string;
  color: string;
}

export type Tag = {
  id: string;
  name: string;
}

// Mock events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: '2025-04-22',
    startTime: '10:00',
    endTime: '11:00',
    description: 'Weekly team sync meeting',
    category: 'work',
    color: '#9b87f5'
  },
  {
    id: '2',
    title: 'Lunch with Alex',
    date: '2025-04-22',
    startTime: '12:30',
    endTime: '13:30',
    description: 'Lunch at the Italian restaurant',
    category: 'personal',
    color: '#4ADE80'
  },
  {
    id: '3',
    title: 'Project Deadline',
    date: '2025-04-23',
    startTime: '17:00',
    description: 'Submit final project files',
    category: 'work',
    color: '#9b87f5'
  },
  {
    id: '4',
    title: 'Gym Session',
    date: '2025-04-24',
    startTime: '07:00',
    endTime: '08:00',
    category: 'health',
    color: '#FACC15'
  },
  {
    id: '5',
    title: 'Doctor Appointment',
    date: '2025-04-25',
    startTime: '14:00',
    endTime: '15:00',
    description: 'Annual checkup',
    category: 'health',
    color: '#FACC15'
  },
];

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review project proposal',
    date: '2025-04-22',
    completed: false,
    priority: 'high',
    category: 'work',
    tags: ['project', 'urgent']
  },
  {
    id: '2',
    title: 'Prepare presentation slides',
    date: '2025-04-22',
    completed: false,
    priority: 'medium',
    category: 'work',
    tags: ['presentation']
  },
  {
    id: '3',
    title: 'Call insurance company',
    date: '2025-04-22',
    completed: true,
    priority: 'low',
    category: 'personal',
    tags: ['admin']
  },
  {
    id: '4',
    title: 'Order new laptop',
    date: '2025-04-23',
    completed: false,
    priority: 'medium',
    category: 'work',
    tags: ['shopping', 'tech']
  },
  {
    id: '5',
    title: 'Schedule team building event',
    date: '2025-04-23',
    completed: false,
    priority: 'low',
    category: 'work',
    tags: ['team']
  },
];

// Mock categories
export const mockCategories: Category[] = [
  { id: '1', name: 'work', color: '#9b87f5' },
  { id: '2', name: 'personal', color: '#4ADE80' },
  { id: '3', name: 'health', color: '#FACC15' },
  { id: '4', name: 'learning', color: '#F87171' },
];

// Mock tags
export const mockTags: Tag[] = [
  { id: '1', name: 'project' },
  { id: '2', name: 'urgent' },
  { id: '3', name: 'presentation' },
  { id: '4', name: 'admin' },
  { id: '5', name: 'shopping' },
  { id: '6', name: 'tech' },
  { id: '7', name: 'team' },
];
