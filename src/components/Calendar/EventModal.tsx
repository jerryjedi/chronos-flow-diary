
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Event } from '@/data/mockData';
import CategoryLabel from '@/components/common/CategoryLabel';
import { Edit } from 'lucide-react';
import PriorityBadge from '@/components/common/PriorityBadge';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onEdit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}
            </div>
            
            <div className="flex items-center gap-2">
              {event.priority && (
                <PriorityBadge priority={event.priority} />
              )}
              
              {event.category && (
                <CategoryLabel name={event.category} color={event.color} />
              )}
            </div>
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
