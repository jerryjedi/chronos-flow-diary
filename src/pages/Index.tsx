
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CalendarView from '@/components/Calendar/CalendarView';
import TaskList from '@/components/Tasks/TaskList';
import ImportCalendar from '@/components/FileImport/ImportCalendar';
import { mockEvents, mockTasks, mockCategories, Event, Task } from '@/data/mockData';
import { getTasksForDay } from '@/utils/calendarUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventModal from '@/components/Calendar/EventModal';
import EventForm from '@/components/Calendar/EventForm';
import { toast } from 'sonner';

const Index = () => {
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
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
    toast.success('Event updated successfully');
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully');
  };

  const handleEventClick = (event: Event) => {
    console.log("Event clicked in Index view:", event);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Clear selected event after modal is closed
    setTimeout(() => {
      if (!isFormOpen) {
        setSelectedEvent(null);
      }
    }, 300);
  };
  
  const handleEditEvent = () => {
    console.log("Edit event triggered in Index view", selectedEvent);
    if (!selectedEvent) return;
    
    // Close the modal first
    setIsModalOpen(false);
    
    // Add delay to ensure the first modal is closed before opening the form
    setTimeout(() => {
      setIsFormOpen(true);
    }, 300);
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
              onEventClick={handleEventClick}
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
              onEventClick={handleEventClick}
            />
          </CardContent>
        </Card>
      </div>

      {/* Event Modal with edit and delete functionality */}
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Event Form for editing events */}
      {selectedEvent && (
        <EventForm 
          event={selectedEvent} 
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            // Clear selected event after form is closed
            setTimeout(() => {
              setSelectedEvent(null);
            }, 300);
          }}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          categories={mockCategories}
        />
      )}
    </Layout>
  );
};

export default Index;
