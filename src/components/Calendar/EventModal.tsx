
import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Event } from '@/data/mockData';
import CategoryLabel from '@/components/common/CategoryLabel';
import { Edit, Trash2 } from 'lucide-react';
import PriorityBadge from '@/components/common/PriorityBadge';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onEdit, onDelete }) => {
  if (!event) return null;
  
  // Parse date safely to prevent issues on different browsers
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    onDelete(event.id);
                  }
                }} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {formatDate(event.date)}
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
              <div className="text-sm whitespace-pre-line">{event.description}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
