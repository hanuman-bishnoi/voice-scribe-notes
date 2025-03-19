
import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  className, 
  size = 'md', 
  animate = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  return (
    <div className={cn(
      'relative flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {animate && (
        <>
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-waves"></div>
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-waves" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-waves" style={{ animationDelay: '1s' }}></div>
        </>
      )}
      <div className="relative z-10 p-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
        <Mic className={cn(
          'transition-transform duration-300',
          animate ? 'animate-pulse-gentle' : ''
        )} />
      </div>
    </div>
  );
};

export default AnimatedLogo;
