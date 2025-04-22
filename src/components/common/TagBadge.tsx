
import React from 'react';

interface TagBadgeProps {
  tag: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
  return (
    <span className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
      {tag}
    </span>
  );
};

export default TagBadge;
