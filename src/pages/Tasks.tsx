
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TaskList from '@/components/Tasks/TaskList';
import { mockTasks, mockCategories, mockEvents, Event } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventModal from '@/components/Calendar/EventModal';
import EventForm from '@/components/Calendar/EventForm';
import { toast } from 'sonner';

const Tasks = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Sort tasks by date (newest first) and then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by date (newest first)
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // If dates are equal, sort by priority (high → medium → low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  const handleEventClick = (event: Event) => {
    console.log("Event clicked in Tasks view:", event);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Give time for modal to close before clearing the event
    setTimeout(() => {
      if (!isFormOpen) {
        setSelectedEvent(null);
      }
    }, 300);
  };

  const handleEditEvent = () => {
    console.log("Edit event triggered in Tasks view", selectedEvent);
    if (!selectedEvent) return;
    
    // Close the modal first
    setIsModalOpen(false);
    
    // Add delay to ensure the first modal is closed before opening the form
    setTimeout(() => {
      setIsFormOpen(true);
    }, 300);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    console.log("Updating event in Tasks view:", updatedEvent);
    setEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    toast.success('Event updated successfully');
    
    // Close the form
    setIsFormOpen(false);
    
    // Clear the selected event after a delay to prevent rendering issues
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast.success('Event deleted successfully');
    setIsModalOpen(false);
    
    // Clear the selected event
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300);
  };
  
  // Debug the state
  console.log("Tasks state:", {
    selectedEvent,
    isModalOpen,
    isFormOpen,
    tasksCount: tasks.length,
    eventsCount: events.length
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-500">All Tasks</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList 
            tasks={sortedTasks} 
            date={new Date()} 
            onToggleComplete={handleToggleComplete}
            onEventClick={handleEventClick}
          />
        </CardContent>
      </Card>

      {/* Event Modal - Uses AlertDialog under the hood */}
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Event Form - Only render when we have a selected event and isFormOpen is true */}
      {selectedEvent && (
        <EventForm 
          event={selectedEvent} 
          isOpen={isFormOpen} 
          onClose={() => {
            setIsFormOpen(false);
            // Clear the selected event after a delay to prevent rendering issues
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

export default Tasks;
