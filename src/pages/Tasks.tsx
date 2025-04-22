
import React from 'react';
import Layout from '@/components/Layout';
import TaskList from '@/components/Tasks/TaskList';
import { mockTasks } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Tasks = () => {
  // Sort tasks by date (newest first) and then by priority
  const sortedTasks = [...mockTasks].sort((a, b) => {
    // First sort by date (newest first)
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // If dates are equal, sort by priority (high → medium → low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-500">All Tasks</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList 
            tasks={sortedTasks} 
            date={new Date()} 
            onToggleComplete={(taskId, completed) => {
              // This would be updated to handle state management in a real app
              console.log('Toggle task:', taskId, completed);
            }} 
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Tasks;
