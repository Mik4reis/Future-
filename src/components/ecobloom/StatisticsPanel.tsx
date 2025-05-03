
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from './Badge';

interface StatisticsPanelProps {
  treeCount: number;
  co2Captured: number;
  stellarEnergy: number;
  level: number;
  experience: number;
  nextLevelExp: number;
  badges: {
    type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
    name: string;
    description: string;
    unlocked: boolean;
    progress?: number;
  }[];
}

export function StatisticsPanel({
  treeCount,
  co2Captured,
  stellarEnergy,
  level,
  experience,
  nextLevelExp,
  badges
}: StatisticsPanelProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={cn(
      "bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl overflow-hidden transition-all duration-300",
      expanded ? "max-h-[500px]" : "max-h-12"
    )}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-green-600/90 to-green-400/90 backdrop-blur text-white"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold">Impacto Ambiental</span>
          <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs backdrop-blur-sm border border-white/20">
            Nível {level}
          </div>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Level progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1 text-white/90">
            <span>Nível {level}</span>
            <span>{experience}/{nextLevelExp} XP</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all duration-500"
              style={{ width: `${Math.min(100, (experience / nextLevelExp) * 100)}%` }}
            />
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-morphism p-3 rounded-lg hover:bg-white/10 transition-colors group">
            <div className="text-2xl font-bold text-gradient-primary">{treeCount}</div>
            <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors">Árvores Plantadas</div>
          </div>
          
          <div className="glass-morphism p-3 rounded-lg hover:bg-white/10 transition-colors group">
            <div className="text-2xl font-bold text-gradient-primary">{co2Captured.toFixed(1)}</div>
            <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors">kg CO₂ Capturado</div>
          </div>
          
          <div className="glass-morphism p-3 rounded-lg hover:bg-white/10 transition-colors group">
            <div className="text-2xl font-bold text-gradient-primary">{stellarEnergy}</div>
            <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors">Energia Estelar</div>
          </div>
        </div>
        
        {/* Badges */}
        <div>
          <h3 className="font-bold text-sm mb-3 text-white/90">Conquistas</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 mt-2">
            {badges.map((badge, index) => (
              <Badge
                key={`badge-${index}`}
                type={badge.type}
                name={badge.name}
                description={badge.description}
                unlocked={badge.unlocked}
                progress={badge.progress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
