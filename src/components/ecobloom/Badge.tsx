
import { HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { Trophy, Award, Medal, Star, BadgeCheck } from 'lucide-react';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  name: string;
  description: string;
  unlocked?: boolean;
  progress?: number;
}

const badgeIcons = {
  bronze: Star,
  silver: Medal,
  gold: Trophy,
  platinum: Award,
  legendary: BadgeCheck
};

const badgeColors = {
  bronze: 'bg-amber-700',
  silver: 'bg-slate-400',
  gold: 'bg-yellow-500',
  platinum: 'bg-cyan-300',
  legendary: 'bg-purple-600'
};

const badgeTextColors = {
  bronze: 'text-amber-700',
  silver: 'text-slate-400',
  gold: 'text-yellow-500',
  platinum: 'text-cyan-300',
  legendary: 'text-purple-600'
};

export function Badge({ 
  type, 
  name, 
  description, 
  unlocked = false, 
  progress = 0, 
  className, 
  ...props 
}: BadgeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const Icon = badgeIcons[type];
  
  return (
    <div 
      className={cn(
        'relative mx-auto flex flex-col items-center justify-center rounded-full p-1',
        unlocked 
          ? `${badgeColors[type]} animate-shimmer bg-[length:400%_100%] cursor-pointer transition-transform hover:scale-110` 
          : 'bg-gray-300 opacity-50',
        className
      )}
      onClick={() => setShowDetails(!showDetails)}
      {...props}
    >
      <div className={cn(
        'rounded-full p-4 transition-all duration-300',
        unlocked ? 'bg-white/90' : 'bg-white/50'
      )}>
        <Icon 
          className={cn(
            'w-10 h-10',
            unlocked ? badgeTextColors[type] : 'text-gray-500',
            unlocked && 'animate-pulse-grow'
          )}
        />
      </div>
      
      {/* Badge Details Popup */}
      {showDetails && (
        <div className="absolute -top-2 -right-2 transform translate-x-full bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-10 w-48 text-left animate-scale-up">
          <h4 className={cn("font-bold text-sm", badgeTextColors[type])}>{name}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{description}</p>
          {!unlocked && progress > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={cn("h-1.5 rounded-full", badgeColors[type])} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1">{progress}%</p>
            </div>
          )}
        </div>
      )}
      
      {/* Badge Name Label */}
      <span className={cn(
        "absolute -bottom-6 text-xs font-medium",
        unlocked ? badgeTextColors[type] : 'text-gray-500'
      )}>
        {name}
      </span>
    </div>
  );
}
