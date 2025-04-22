
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CalendarView from '@/components/Calendar/CalendarView';
import TaskList from '@/components/Tasks/TaskList';
import ImportCalendar from '@/components/FileImport/ImportCalendar';
import { mockEvents, mockTasks, Event, Task } from '@/data/mockData';
import { getTasksForDay } from '@/utils/calendarUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  // Get tasks for today
  const todayTasks = getTasksForDay(tasks, currentDate);
  
  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };
  
  const handleImportCalendar = (importedEvents: Event[]) => {
    setEvents(prev => [...prev, ...importedEvents]);
  };

  const handleAddEvent = (newEvent: Event) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-500">My Calendar</h1>
        <ImportCalendar onImport={handleImportCalendar} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarView 
              events={events}
              onEventAdd={handleAddEvent}
              onEventUpdate={handleUpdateEvent}
              onEventDelete={handleDeleteEvent}
            />
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in" style={{animationDelay: '0.1s'}}>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList 
              tasks={todayTasks} 
              date={currentDate}
              onToggleComplete={handleToggleComplete} 
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
