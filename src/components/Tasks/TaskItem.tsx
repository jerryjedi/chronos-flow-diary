
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, Event } from '@/data/mockData';
import PriorityBadge from '@/components/common/PriorityBadge';
import CategoryLabel from '@/components/common/CategoryLabel';
import TagBadge from '@/components/common/TagBadge';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEventClick?: (event: Event) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEventClick }) => {
  const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onToggleComplete(task.id, !task.completed);
  };

  const handleRelatedEventClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onEventClick && task.relatedEventId) {
      // Create a complete event object to show task details
      const taskEvent: Event = {
        id: task.relatedEventId,
        title: task.title,
        date: task.date,
        description: task.description,
        category: task.category,
        // Remove color if it doesn't exist in the Task type
        priority: task.priority
      };
      
      console.log("Clicking related event with data:", taskEvent);
      onEventClick(taskEvent);
    }
  };

  const hasRelatedEvent = !!task.relatedEventId;

  return (
    <div 
      className={`task-item p-3 border rounded-md mb-2 ${task.completed ? 'bg-muted/30' : ''} transition-colors`}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={() => {}}
          onClick={handleToggle}
          className="mt-1"
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <PriorityBadge priority={task.priority} size="sm" />
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.category && (
              <CategoryLabel name={task.category} />
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}
            
            {hasRelatedEvent && (
              <button 
                type="button"
                onClick={handleRelatedEventClick}
                className="text-xs text-purple-500 font-medium hover:underline cursor-pointer"
              >
                Has linked event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
