
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Event } from '@/data/mockData';
import CategoryLabel from '@/components/common/CategoryLabel';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}
            </div>
            {event.category && (
              <CategoryLabel name={event.category} color={event.color} />
            )}
          </div>
          
          {(event.startTime || event.endTime) && (
            <div className="text-sm font-medium">
              {event.startTime && (
                <span>
                  {event.startTime}
                  {event.endTime && ` - ${event.endTime}`}
                </span>
              )}
            </div>
          )}
          
          {event.description && (
            <div className="pt-2 border-t">
              <div className="text-sm">{event.description}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
