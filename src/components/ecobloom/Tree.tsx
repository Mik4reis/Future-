
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TreeProps {
  x: number;
  y: number;
  size: number;
  mature: boolean;
  age: number;
  biome: 'tropical' | 'temperate';
  onClick?: () => void;
}

export function Tree({ 
  x, 
  y, 
  size, 
  mature, 
  age, 
  biome, 
  onClick 
}: TreeProps) {
  const [shake, setShake] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  
  const handleTreeClick = () => {
    setShake(true);
    setShowInfo(true);
    setSparkle(true);
    if (onClick) onClick();
    
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setSparkle(false), 800);
    setTimeout(() => setShowInfo(false), 3000);
  };
  
  const getMaturityPercent = () => {
    const maturityTime = biome === 'tropical' ? 60 : 70;
    return Math.min(100, Math.round((age / maturityTime) * 100));
  };
  
  // Calculate tree colors based on maturity and biome
  const trunkColor = biome === 'tropical' ? 'eco-ground' : 'eco-darkLeaf';
  const leafColor = mature 
    ? (biome === 'tropical' ? 'eco-coral' : 'eco-gold') 
    : 'eco-leaf';
  
  return (
    <div 
      className="absolute cursor-pointer transform transition-transform hover:scale-105"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        zIndex: Math.round(y),
        transform: `perspective(1000px) rotateX(10deg)`,
        transformOrigin: 'bottom'
      }}
      onClick={handleTreeClick}
    >
      {/* Tree trunk */}
      <div 
        className={cn(
          "absolute left-1/2 bottom-0 transform -translate-x-1/2",
          `bg-${trunkColor}`,
          shake && 'animate-wind',
          "transition-all duration-300 ease-out"
        )}
        style={{ 
          width: `${5 + size / 5}px`, 
          height: `${20 + size}px`,
          borderRadius: '2px',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}
      />
      
      {/* Tree canopy */}
      <div 
        className={cn(
          "absolute left-1/2 transform -translate-x-1/2",
          `bg-${leafColor}`,
          mature && 'animate-float',
          shake && 'animate-wind',
          sparkle && 'animate-pulse-grow',
          "transition-all duration-300 ease-out"
        )}
        style={{ 
          width: `${30 + size}px`, 
          height: `${30 + size}px`,
          bottom: `${15 + size}px`,
          borderRadius: '50% 50% 10% 10%',
          boxShadow: mature 
            ? '0 0 15px rgba(255, 215, 0, 0.3), inset 0 -5px 15px rgba(0,0,0,0.2)' 
            : 'inset 0 -5px 15px rgba(0,0,0,0.2)'
        }}
      >
        {sparkle && (
          <div className="absolute inset-0 animate-sparkle bg-gradient-to-t from-transparent to-white/20 rounded-full" />
        )}
      </div>
      
      {/* Tree info popup */}
      {showInfo && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 glass-morphism px-3 py-2 rounded-lg text-xs shadow-xl animate-scale-up z-10 whitespace-nowrap">
          <p className="font-bold text-gradient">{mature ? 'Árvore Adulta' : 'Árvore Jovem'}</p>
          <p className="text-white/90">Idade: {age} dias</p>
          <div className="mt-1">
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all duration-500"
                style={{ width: `${getMaturityPercent()}%` }}
              />
            </div>
            <p className="text-[10px] text-white/70 mt-0.5">Maturidade: {getMaturityPercent()}%</p>
          </div>
          {mature && (
            <p className="text-green-400 mt-1 text-[10px] font-medium">
              +2 CO₂ capturado/dia
            </p>
          )}
        </div>
      )}
    </div>
  );
}
