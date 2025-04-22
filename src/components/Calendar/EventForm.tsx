
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Event, Category } from '@/data/mockData';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

interface EventFormProps {
  event?: Event;
  date?: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete?: (id: string) => void;
  categories: Category[];
}

const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  date, 
  isOpen, 
  onClose, 
  onSave,
  onDelete,
  categories
}) => {
  const isEditMode = !!event;
  
  // Format the initialDate for cross-browser compatibility
  const getFormattedDate = (inputDate?: Date | string): string => {
    if (!inputDate) return format(new Date(), 'yyyy-MM-dd');
    
    try {
      if (typeof inputDate === 'string') {
        // Handle YYYY-MM-DD format
        if (inputDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return inputDate;
        }
        // Try to parse other string formats
        const parsedDate = new Date(inputDate);
        return format(parsedDate, 'yyyy-MM-dd');
      } else {
        // It's a Date object
        return format(inputDate, 'yyyy-MM-dd');
      }
    } catch (e) {
      console.error("Date parsing error:", e);
      return format(new Date(), 'yyyy-MM-dd');
    }
  };
  
  const initialDate = event ? getFormattedDate(event.date) : date ? getFormattedDate(date) : getFormattedDate(new Date());
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(initialDate);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Reset form when dialog opens/closes or when event/date changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        setTitle(event.title || '');
        setDescription(event.description || '');
        setEventDate(getFormattedDate(event.date));
        setStartTime(event.startTime || '');
        setEndTime(event.endTime || '');
        setCategory(event.category || '');
        setPriority((event.priority as 'low' | 'medium' | 'high') || 'medium');
      } else {
        resetForm();
        if (date) {
          setEventDate(getFormattedDate(date));
        }
      }
    }
  }, [event, date, isOpen]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEventDate(format(new Date(), 'yyyy-MM-dd'));
    setStartTime('');
    setEndTime('');
    setCategory('');
    setPriority('medium');
  };
  
  // Handle form submission with proper validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!eventDate) {
      toast.error("Date is required");
      return;
    }
    
    const categoryObj = categories.find(c => c.name === category);
    
    const updatedEvent: Event = {
      id: event?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      date: eventDate,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      category: category || undefined,
      color: categoryObj?.color,
      priority
    };
    
    console.log("Saving event:", updatedEvent);
    onSave(updatedEvent);
    onClose();
  };
  
  // Don't render if not open
  if (!isOpen) return null;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isEditMode ? 'Edit Event' : 'Add Event'}
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup value={priority} onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')} className="flex space-x-2">
              <div className="flex items-center">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="pl-2">Low</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="pl-2">Medium</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="pl-2">High</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <AlertDialogFooter className="gap-2 sm:gap-0">
            {isEditMode && onDelete && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    onDelete(event.id);
                    onClose();
                  }
                }}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="submit">
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventForm;
