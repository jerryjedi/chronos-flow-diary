
import React from 'react';

type PriorityType = 'low' | 'medium' | 'high';

interface PriorityBadgeProps {
  priority: PriorityType;
  size?: 'sm' | 'md' | 'lg';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const priorityColors = {
    low: 'bg-priority-low',
    medium: 'bg-priority-medium',
    high: 'bg-priority-high',
  };
  
  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium text-white ${priorityColors[priority]} ${sizeClasses[size]}`}
    >
      {priorityLabels[priority]}
    </span>
  );
};

export default PriorityBadge;
