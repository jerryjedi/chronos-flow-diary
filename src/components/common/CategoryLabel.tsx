
import React from 'react';

interface CategoryLabelProps {
  name: string;
  color?: string;
}

const CategoryLabel: React.FC<CategoryLabelProps> = ({ name, color = '#9b87f5' }) => {
  return (
    <div className="inline-flex items-center gap-1.5">
      <div 
        className="w-2.5 h-2.5 rounded-full" 
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-medium capitalize">{name}</span>
    </div>
  );
};

export default CategoryLabel;
