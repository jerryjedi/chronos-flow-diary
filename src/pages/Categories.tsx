
import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { mockEvents, mockCategories } from '@/data/mockData';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import EventModal from '@/components/Calendar/EventModal';
import EventForm from '@/components/Calendar/EventForm';
import { toast } from 'sonner';
import { Event } from '@/data/mockData';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [events, setEvents] = useState(mockEvents);

  // Get categories and their counts
  const categoriesWithCount = useMemo(() => {
    const counts = events.reduce<Record<string, number>>((acc, event) => {
      if (event.category) {
        acc[event.category] = (acc[event.category] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .map(([category, count]) => ({
        name: category,
        count
      }));
  }, [events]);

  // Get top 10 categories
  const topCategories = categoriesWithCount.slice(0, 10);
  const hasMoreCategories = categoriesWithCount.length > 10;

  // Get events for selected category
  const categoryEvents = useMemo(() => {
    if (!selectedCategory) return [];
    return events
      .filter(event => event.category === selectedCategory)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedCategory, events]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;
    setIsModalOpen(false);
    setIsFormOpen(true);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    toast.success('Event updated successfully');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast.success('Event deleted successfully');
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-purple-500">Categories</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {topCategories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex gap-2"
                >
                  {category.name}
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </Button>
              ))}
            </div>

            {hasMoreCategories && (
              <Select
                value={selectedCategory || ''}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="More categories..." />
                </SelectTrigger>
                <SelectContent>
                  {categoriesWithCount.slice(10).map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {selectedCategory && (
          <Card>
            <CardHeader>
              <CardTitle>Events in {selectedCategory}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex justify-between items-center p-4 rounded-lg border cursor-pointer hover:bg-accent/50"
                    onClick={() => handleEventClick(event)}
                  >
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(event.date), 'PPP')}
                        {event.startTime && ` · ${event.startTime}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {selectedEvent && (
          <EventModal 
            event={selectedEvent}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        )}

        {selectedEvent && (
          <EventForm 
            event={selectedEvent} 
            isOpen={isFormOpen} 
            onClose={() => setIsFormOpen(false)}
            onSave={handleUpdateEvent}
            onDelete={handleDeleteEvent}
            categories={mockCategories}
          />
        )}
      </div>
    </Layout>
  );
};

export default Categories;
