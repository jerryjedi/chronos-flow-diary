
import React from 'react';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Event } from '@/data/mockData';
import CategoryLabel from '@/components/common/CategoryLabel';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import PriorityBadge from '@/components/common/PriorityBadge';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onEdit, onDelete }) => {
  // Ensure we don't render until we have an event object
  if (!event) return null;
  
  // Parse date safely to prevent issues on different browsers
  const formatDate = (dateString: string) => {
    try {
      // Ensure the date string format works in Safari/Edge
      if (!dateString) return '';
      
      // Handle YYYY-MM-DD format explicitly for cross-browser support
      let date;
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || '';
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(event.id);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event.title || 'Event'}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
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
        <AlertDialogFooter className="gap-2">
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              className="mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          )}
          {onEdit && (
            <AlertDialogAction asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </AlertDialogAction>
          )}
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventModal;
