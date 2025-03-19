
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center p-8 rounded-lg space-y-4 animate-fade-in',
      className
    )}>
      {icon && (
        <div className="text-muted-foreground mb-2 p-3 bg-muted rounded-full">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-medium">{title}</h3>
      
      <p className="text-muted-foreground max-w-sm">
        {description}
      </p>
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
