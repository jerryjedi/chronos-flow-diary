
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Event, Category, mockCategories } from '@/data/mockData';

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
  const initialDate = event ? event.date : date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(initialDate);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setEventDate(event.date);
      setStartTime(event.startTime || '');
      setEndTime(event.endTime || '');
      setCategory(event.category || '');
      setPriority((event.priority as 'low' | 'medium' | 'high') || 'medium');
    } else {
      resetForm();
      if (date) {
        setEventDate(format(date, 'yyyy-MM-dd'));
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryObj = categories.find(c => c.name === category);
    
    const updatedEvent: Event = {
      id: event?.id || crypto.randomUUID(),
      title,
      description,
      date: eventDate,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      category: category || undefined,
      color: categoryObj?.color,
      priority
    };
    
    onSave(updatedEvent);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        
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
                <SelectItem value="">None</SelectItem>
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
          
          <DialogFooter className="gap-2 sm:gap-0">
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
