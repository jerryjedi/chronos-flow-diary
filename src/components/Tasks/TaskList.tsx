
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Task } from '@/data/mockData';
import TaskItem from './TaskItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskListProps {
  tasks: Task[];
  date: Date;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, date, onToggleComplete }) => {
  const [filter, setFilter] = useState<string>('all');
  
  // Apply filters
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true; // 'all'
  });
  
  // Sort by priority (high → medium → low)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks for {format(date, 'MMM d')}</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggleComplete={onToggleComplete} 
            />
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No tasks to display
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
