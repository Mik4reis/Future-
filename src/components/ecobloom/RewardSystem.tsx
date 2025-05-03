
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Gift, Star, Trophy, BadgeCheck } from 'lucide-react';
import { Badge } from './Badge';

interface RewardProps {
  showReward: boolean;
  rewardTitle: string;
  rewardDescription: string;
  rewardType: 'level' | 'badge' | 'bonus';
  badgeType?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  onClose: () => void;
}

export function RewardPopup({
  showReward,
  rewardTitle,
  rewardDescription,
  rewardType,
  badgeType = 'bronze',
  onClose
}: RewardProps) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (showReward) {
      setVisible(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Call onClose after animation completes
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showReward, onClose]);
  
  if (!showReward && !visible) return null;
  
  return (
    <div className={cn(
      "fixed inset-0 flex items-center justify-center z-50 bg-black/50 transition-opacity",
      visible ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className={cn(
        "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-sm text-center transition-all duration-500",
        visible ? "scale-100" : "scale-75"
      )}>
        <div className="flex justify-center mb-4">
          {rewardType === 'level' && (
            <div className="w-20 h-20 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
          )}
          
          {rewardType === 'badge' && badgeType && (
            <Badge
              type={badgeType}
              name=""
              description=""
              unlocked={true}
              className="w-24 h-24"
            />
          )}
          
          {rewardType === 'bonus' && (
            <div className="w-20 h-20 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full">
              <Gift className="h-10 w-10 text-green-500" />
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-bold mb-2">{rewardTitle}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{rewardDescription}</p>
        
        <div className="animate-bounce mb-4">
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={`star-${i}`} className="w-5 h-5 text-yellow-500" />
            ))}
          </div>
        </div>
        
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 500);
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// Rewards notification component
interface RewardNotificationProps {
  message: string;
  type: 'level' | 'badge' | 'bonus';
}

export function RewardNotification({ message, type }: RewardNotificationProps) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs animate-notification z-50">
      <div className="flex items-center gap-3">
        {type === 'level' && <Trophy className="w-5 h-5 text-yellow-500" />}
        {type === 'badge' && <BadgeCheck className="w-5 h-5 text-purple-500" />}
        {type === 'bonus' && <Gift className="w-5 h-5 text-green-500" />}
        
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

// Reward System Context/Manager
export interface RewardSystem {
  calculateRewards: (donation: number, currentState: any) => {
    rewards: {
      type: 'level' | 'badge' | 'bonus';
      title: string;
      description: string;
      badgeType?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
    }[];
    experience: number;
    stellarEnergy: number;
    leveledUp: boolean;
  };
  
  getUnlockedBadges: (state: any) => {
    type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
    name: string;
    description: string;
    unlocked: boolean;
    progress?: number;
  }[];
}

export const createRewardSystem = (): RewardSystem => {
  return {
    calculateRewards: (donation, currentState) => {
      const rewards = [];
      let experience = Math.floor(donation * 10);
      let stellarEnergy = 0;
      let leveledUp = false;
      
      // Basic experience gain
      if (donation >= 7) {
        stellarEnergy += Math.floor(donation / 7);
      }
      
      // Level up check
      const newTotalExp = currentState.experience + experience;
      if (newTotalExp >= currentState.nextLevelExp) {
        leveledUp = true;
        rewards.push({
          type: 'level',
          title: `Nível ${currentState.level + 1} Alcançado!`,
          description: 'Você atingiu um novo nível de guardiã(o) da natureza!'
        });
      }
      
      // Milestone badges
      if (currentState.treeCount < 10 && currentState.treeCount + Math.floor(donation / 7) >= 10) {
        rewards.push({
          type: 'badge',
          badgeType: 'bronze',
          title: 'Jardineiro Iniciante',
          description: 'Plantar 10 árvores é o começo de uma grande jornada!'
        });
      }
      
      if (currentState.treeCount < 50 && currentState.treeCount + Math.floor(donation / 7) >= 50) {
        rewards.push({
          type: 'badge',
          badgeType: 'silver',
          title: 'Guardião da Floresta',
          description: 'Suas 50 árvores estão transformando o planeta!'
        });
      }
      
      if (currentState.treeCount < 100 && currentState.treeCount + Math.floor(donation / 7) >= 100) {
        rewards.push({
          type: 'badge',
          badgeType: 'gold',
          title: 'Mestre Florestal',
          description: 'Uma centena de árvores! Você é incrível!'
        });
      }
      
      // First time large donation
      if (donation >= 50 && !currentState.badges.find(b => b.name === 'Coração Generoso')) {
        rewards.push({
          type: 'badge',
          badgeType: 'platinum',
          title: 'Coração Generoso',
          description: 'Sua generosidade é um exemplo para todos!'
        });
        stellarEnergy += 20;
      }
      
      // Random bonuses (~20% chance)
      if (Math.random() > 0.8) {
        const bonusExp = Math.floor(experience * 0.5);
        experience += bonusExp;
        rewards.push({
          type: 'bonus',
          title: 'Bônus de Experiência!',
          description: `+${bonusExp} XP de bônus pela sua dedicação!`
        });
      }
      
      return {
        rewards,
        experience,
        stellarEnergy,
        leveledUp
      };
    },
    
    getUnlockedBadges: (state) => {
      const allBadges = [
        {
          type: 'bronze' as const,
          name: 'Jardineiro Iniciante',
          description: 'Plantar 10 árvores',
          unlocked: state.treeCount >= 10,
          progress: state.treeCount < 10 ? (state.treeCount / 10) * 100 : 100
        },
        {
          type: 'bronze' as const,
          name: 'Primeiro Passo',
          description: 'Fazer sua primeira doação',
          unlocked: state.donations > 0,
          progress: state.donations > 0 ? 100 : 0
        },
        {
          type: 'silver' as const,
          name: 'Guardião da Floresta',
          description: 'Plantar 50 árvores',
          unlocked: state.treeCount >= 50,
          progress: state.treeCount < 50 ? (state.treeCount / 50) * 100 : 100
        },
        {
          type: 'gold' as const,
          name: 'Mestre Florestal',
          description: 'Plantar 100 árvores',
          unlocked: state.treeCount >= 100,
          progress: state.treeCount < 100 ? (state.treeCount / 100) * 100 : 100
        },
        {
          type: 'gold' as const,
          name: 'Protetor Leal',
          description: 'Fazer 5 doações',
          unlocked: state.donations >= 5,
          progress: state.donations < 5 ? (state.donations / 5) * 100 : 100
        },
        {
          type: 'platinum' as const,
          name: 'Coração Generoso',
          description: 'Doar R$50 ou mais de uma vez',
          unlocked: state.badges.some(b => b.name === 'Coração Generoso'),
          progress: 0 // Either unlocked or not
        },
        {
          type: 'platinum' as const,
          name: 'Guardião Celestial',
          description: 'Acumular 100 de Energia Estelar',
          unlocked: state.resources.stellarEnergy >= 100,
          progress: state.resources.stellarEnergy < 100 ? (state.resources.stellarEnergy / 100) * 100 : 100
        },
        {
          type: 'legendary' as const,
          name: 'Lenda da Natureza',
          description: 'Alcançar o nível 10',
          unlocked: state.level >= 10,
          progress: state.level < 10 ? (state.level / 10) * 100 : 100
        },
        {
          type: 'legendary' as const,
          name: 'Herói do Planeta',
          description: 'Capturar 1000kg de CO₂',
          unlocked: state.co2Captured >= 1000,
          progress: state.co2Captured < 1000 ? (state.co2Captured / 1000) * 100 : 100
        },
        {
          type: 'legendary' as const,
          name: 'Patrono da Terra',
          description: 'Doar um total de R$500',
          unlocked: state.totalDonated >= 500,
          progress: state.totalDonated < 500 ? (state.totalDonated / 500) * 100 : 100
        }
      ];
      
      return allBadges;
    }
  };
};
