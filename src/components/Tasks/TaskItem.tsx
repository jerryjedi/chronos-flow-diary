
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/data/mockData';
import PriorityBadge from '@/components/common/PriorityBadge';
import CategoryLabel from '@/components/common/CategoryLabel';
import TagBadge from '@/components/common/TagBadge';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete }) => {
  const handleToggle = () => {
    onToggleComplete(task.id, !task.completed);
  };

  return (
    <div className={`task-item ${task.completed ? 'bg-muted/30' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={handleToggle}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
