
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, setMonth, setYear } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event, mockCategories } from '@/data/mockData';
import { getCalendarDays, getEventsForDay } from '@/utils/calendarUtils';
import EventModal from './EventModal';
import EventForm from './EventForm';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalendarViewProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onEventAdd?: (event: Event) => void;
  onEventUpdate?: (event: Event) => void;
  onEventDelete?: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  events,
  onEventClick,
  onEventAdd,
  onEventUpdate,
  onEventDelete
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  
  // Clear states when events array changes
  useEffect(() => {
    if (!isModalOpen && !isFormOpen) {
      setSelectedEvent(null);
      setEditingEvent(undefined);
    }
  }, [events, isModalOpen, isFormOpen]);
  
  const calendarDays = getCalendarDays(currentDate);
  
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleMonthChange = (month: string) => {
    setCurrentDate(setMonth(currentDate, parseInt(month)));
  };

  const handleYearChange = (year: string) => {
    setCurrentDate(setYear(currentDate, parseInt(year)));
  };
  
  const handleEventClick = (event: Event) => {
    console.log("Event clicked:", event);
    setSelectedEvent(event);
    setIsModalOpen(true);
    if (onEventClick) {
      onEventClick(event);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddEvent = (date?: Date) => {
    setFormDate(date);
    setEditingEvent(undefined);
    setIsFormOpen(true);
  };

  const handleEditEvent = () => {
    console.log("Edit event triggered", selectedEvent);
    if (!selectedEvent) return;
    
    // Important: close the modal first, then set editing event and open form
    setIsModalOpen(false);
    setEditingEvent({...selectedEvent});
    
    // Ensure form opens after modal closes with a short delay
    setTimeout(() => {
      setIsFormOpen(true);
    }, 100);
  };

  const handleSaveEvent = (event: Event) => {
    console.log("Saving event:", event, "Editing mode:", !!editingEvent);
    
    if (editingEvent) {
      if (onEventUpdate) {
        onEventUpdate(event);
      }
      toast.success('Event updated successfully');
    } else {
      if (onEventAdd) {
        onEventAdd(event);
      }
      toast.success('Event created successfully');
    }
    
    // Reset editing state after saving
    setIsFormOpen(false);
    setEditingEvent(undefined);
  };

  const handleDeleteEvent = (id: string) => {
    if (onEventDelete) {
      onEventDelete(id);
      toast.success('Event deleted successfully');
    }
    handleCloseModal();
  };

  // Generate year options (current year ± 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
          <Select value={currentDate.getMonth().toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(new Date(2024, i, 1), 'MMMM')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentDate.getFullYear().toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => handleAddEvent()}>
            <Plus className="h-4 w-4 mr-1" /> Event
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-0.5">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center p-2 font-medium">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const dayEvents = getEventsForDay(events, day);
          
          return (
            <div 
              key={index} 
              className={`calendar-day min-h-24 ${!isCurrentMonth ? 'text-muted-foreground bg-muted/30' : ''}`}
              onClick={() => handleAddEvent(day)}
            >
              <div className="calendar-day-header text-right">
                {format(day, 'd')}
              </div>
              <div className="flex-1 overflow-y-auto max-h-20">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="calendar-event"
                    style={{ backgroundColor: event.color || '#9b87f5' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    {event.startTime && (
                      <span className="font-medium">{event.startTime}</span>
                    )}{' '}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Event Modal - Only show when isModalOpen is true and selectedEvent exists */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* Event Form - Only show when isFormOpen is true */}
      <EventForm 
        event={editingEvent} 
        date={formDate}
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(undefined);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        categories={mockCategories}
      />
    </div>
  );
};

export default CalendarView;
