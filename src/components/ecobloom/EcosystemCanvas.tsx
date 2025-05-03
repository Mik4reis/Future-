import { useRef, useState } from 'react';
import { Tree } from './Tree';
import { cn } from '@/lib/utils';

// Types for ecosystem elements
export type Layer = 'surface' | 'sky';
export type Weather = 'sunny' | 'rainy' | 'windy' | 'cosmic';
export type TimeOfDay = 'day' | 'night';
export type Biome = 'tropical' | 'temperate';

export interface EcosystemElement {
  id: string;
  type: string;
  x: number;
  y: number;
  size: number;
  age: number;
  mature?: boolean;
  color?: string;
}

export interface EcosystemState {
  layers: Record<Layer, EcosystemElement[]>;
  totalElements: number;
  weather: Weather;
  timeOfDay: TimeOfDay;
  zoom: number;
  panX: number;
  resources: {
    wood: number;
    water: number;
    stellarEnergy: number;
  };
  co2Captured: number;
  biome: Biome;
}

interface EcosystemCanvasProps {
  ecosystem: EcosystemState;
  setEcosystem: React.Dispatch<React.SetStateAction<EcosystemState>>;
  activeLayer: Layer;
  onElementClick?: (element: EcosystemElement) => void;
}

export function EcosystemCanvas({ 
  ecosystem, 
  setEcosystem, 
  activeLayer,
  onElementClick
}: EcosystemCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [startPanPos, setStartPanPos] = useState(0);
  
  // Cloud component
  const Cloud = ({ x, y }: { x: number, y: number }) => (
    <div 
      className="absolute"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        zIndex: 1
      }}
    >
      <div className="relative">
        <div className="absolute w-16 h-8 bg-white/40 rounded-full filter blur-sm animate-float" />
        <div className="absolute w-20 h-8 bg-white/40 rounded-full -left-4 top-2 filter blur-sm animate-float" 
          style={{ animationDelay: '0.2s' }}
        />
        <div className="absolute w-16 h-8 bg-white/40 rounded-full -left-2 -top-1 filter blur-sm animate-float"
          style={{ animationDelay: '0.4s' }}
        />
      </div>
    </div>
  );

  // Ground component
  const Ground = () => (
    <div className="absolute bottom-0 left-0 right-0">
      {/* Gradiente de grama */}
      <div 
        className="h-20 bg-gradient-to-b from-green-600/80 to-green-800/80"
        style={{
          boxShadow: 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px'
        }}
      />
      {/* Terra/Solo */}
      <div 
        className="h-12 bg-gradient-to-b from-eco-ground to-eco-darkLeaf"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      />
    </div>
  );

  // Render clouds
  const renderClouds = () => {
    if (activeLayer === 'surface' && ecosystem.timeOfDay === 'day') {
      return Array.from({ length: 6 }).map((_, i) => (
        <Cloud 
          key={`cloud-${i}`} 
          x={100 + (i * 150) + (Math.sin(Date.now() / 5000 + i) * 30)}
          y={50 + (Math.cos(Date.now() / 5000 + i) * 20)}
        />
      ));
    }
    return null;
  };

  // Weather effects
  const renderWeatherEffects = () => {
    if (ecosystem.weather === 'rainy') {
      // Create rain droplets
      return Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={`rain-${i}`}
          className="absolute w-0.5 h-4 bg-blue-400 rounded-full animate-raindrops opacity-70"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `-10px`,
            animationDuration: `${0.5 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ));
    } else if (ecosystem.weather === 'cosmic') {
      // Create cosmic particles
      return Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={`cosmic-${i}`}
          className="absolute w-2 h-2 rounded-full animate-sparkle"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 50}%`,
            background: `rgba(${150 + Math.random() * 100}, ${150 + Math.random() * 100}, 255, 0.7)`,
            boxShadow: `0 0 10px rgba(100, 100, 255, 0.7)`,
            animationDuration: `${1 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ));
    }
    return null;
  };
  
  // Mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setStartPanPos(ecosystem.panX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const deltaX = e.clientX - startDragPos.x;
      setEcosystem(prev => ({
        ...prev,
        panX: startPanPos + deltaX
      }));
    }
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };
  
  return (
    <div className="relative w-full overflow-hidden">
      {/* Sky background */}
      <div 
        className={cn(
          "absolute w-full h-full transition-colors duration-1000",
          activeLayer === 'sky' 
            ? (ecosystem.timeOfDay === 'day' ? 'bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-gradient-to-b from-indigo-900 to-black')
            : ecosystem.biome === 'tropical' 
              ? 'bg-gradient-to-b from-sky-400 to-sky-200'
              : 'bg-gradient-to-b from-blue-300 to-blue-100'
        )}
      />

      {/* Stars (only visible in sky layer at night) */}
      {activeLayer === 'sky' && ecosystem.timeOfDay === 'night' && (
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>
      )}
      
      {/* Render clouds */}
      {renderClouds()}

      {/* Weather effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderWeatherEffects()}
      </div>
      
      {/* Ecosystem elements container */}
      <div
        ref={canvasRef}
        className={cn(
          "relative w-full h-[400px] overflow-hidden cursor-grab",
          dragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Add Ground when in surface layer */}
        {activeLayer === 'surface' && <Ground />}
        
        {/* Render elements based on active layer with transform for pan */}
        <div 
          className="absolute w-full h-full transition-transform duration-100"
          style={{ 
            transform: `translateX(${ecosystem.panX}px)`,
          }}
        >
          {ecosystem.layers[activeLayer].map(element => {
            if (element.type === 'tree') {
              return (
                <Tree
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  size={element.size}
                  mature={element.mature || false}
                  age={element.age}
                  biome={ecosystem.biome}
                  onClick={() => onElementClick && onElementClick(element)}
                />
              );
            } else if (element.type === 'river' || element.type === 'lake') {
              return (
                <div
                  key={element.id}
                  className="absolute bg-eco-water rounded-full"
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y - 10}px`,
                    width: element.type === 'river' ? '50px' : '40px',
                    height: element.type === 'river' ? '10px' : '40px',
                    borderRadius: element.type === 'river' ? '5px' : '50%',
                    boxShadow: '0 0 10px rgba(30, 144, 255, 0.5)',
                    zIndex: Math.round(element.y) - 1
                  }}
                  onClick={() => onElementClick && onElementClick(element)}
                />
              );
            } else if (element.type === 'star') {
              return (
                <div
                  key={element.id}
                  className="absolute rounded-full animate-pulse-grow"
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.size}px`,
                    height: `${element.size}px`,
                    backgroundColor: 'white',
                    boxShadow: `0 0 ${element.size * 2}px white`,
                    zIndex: 10
                  }}
                  onClick={() => onElementClick && onElementClick(element)}
                />
              );
            } else if (element.type === 'animal') {
              const animalColor = element.color || (ecosystem.biome === 'tropical' ? '#ff4500' : '#8b4513');
              return (
                <div
                  key={element.id}
                  className="absolute animate-float"
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y - 5}px`,
                    width: '15px',
                    height: '8px',
                    backgroundColor: animalColor,
                    borderRadius: '5px 8px 8px 5px',
                    zIndex: Math.round(element.y) + 5
                  }}
                  onClick={() => onElementClick && onElementClick(element)}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
      
      {/* Mini-map */}
      <div className="absolute top-4 right-4 w-32 h-24 bg-white/50 dark:bg-gray-800/50 rounded shadow-lg z-10 border border-gray-300">
        <div className="relative w-full h-full">
          {ecosystem.layers[activeLayer].map((element, i) => (
            <div
              key={`mini-${element.id}`}
              className={cn(
                "absolute w-1 h-1 rounded-full",
                element.type === 'tree' ? 'bg-eco-leaf' :
                element.type === 'river' || element.type === 'lake' ? 'bg-eco-water' :
                element.type === 'animal' ? 'bg-eco-coral' : 'bg-white'
              )}
              style={{
                left: `${(element.x / 800) * 100}%`,
                top: `${(element.y / 400) * 100}%`
              }}
            />
          ))}
          {/* Viewport indicator */}
          <div
            className="absolute border-2 border-red-500 pointer-events-none"
            style={{
              left: `${((-ecosystem.panX / 800) * 100)}%`,
              top: '0%',
              width: '100%',
              height: '100%',
              maxWidth: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
}
