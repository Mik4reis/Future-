
import { useState, useEffect } from 'react';
import { EcosystemCanvas, type EcosystemState, type EcosystemElement, type Layer, type Biome } from '@/components/ecobloom/EcosystemCanvas';
import { StatisticsPanel } from '@/components/ecobloom/StatisticsPanel';
import { DonationPanel } from '@/components/ecobloom/DonationPanel';
import { RewardPopup, RewardNotification, createRewardSystem } from '@/components/ecobloom/RewardSystem';
import { Heart, TreePine, Sparkles } from 'lucide-react';

const rewardSystem = createRewardSystem();

const getNextLevelExp = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

const Index = () => {
  // Ecosystem state
  const [ecosystem, setEcosystem] = useState<EcosystemState>({
    layers: { 
      surface: [], 
      sky: []
    },
    totalElements: 0,
    weather: 'sunny',
    timeOfDay: 'day',
    zoom: 1,
    panX: 0,
    resources: { wood: 0, water: 0, stellarEnergy: 0 },
    co2Captured: 0,
    biome: 'tropical',
  });
  
  // Game state
  const [activeLayer, setActiveLayer] = useState<Layer>('surface');
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [nextLevelExp, setNextLevelExp] = useState(100);
  const [totalDonated, setTotalDonated] = useState(0);
  const [donations, setDonations] = useState(0);
  const [treeCount, setTreeCount] = useState(0);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Rewards and notifications
  const [currentReward, setCurrentReward] = useState<{
    show: boolean;
    title: string;
    description: string;
    type: 'level' | 'badge' | 'bonus';
    badgeType?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  }>({
    show: false,
    title: '',
    description: '',
    type: 'level',
  });
  
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'level' | 'badge' | 'bonus';
  }>({
    show: false,
    message: '',
    type: 'level',
  });
  
  // Initialize badges
  useEffect(() => {
    const initialBadges = rewardSystem.getUnlockedBadges({
      treeCount,
      donations,
      badges,
      level,
      co2Captured: ecosystem.co2Captured,
      totalDonated,
      resources: ecosystem.resources
    });
    
    setBadges(initialBadges);
  }, []);
  
  // Update game cycle (time of day, weather)
  useEffect(() => {
    const gameCycleInterval = setInterval(() => {
      setEcosystem(prev => {
        // Toggle time of day every 30 seconds
        const newTime = new Date();
        const newTimeOfDay = newTime.getSeconds() % 60 < 30 ? 'day' : 'night';
        
        // Change weather randomly every minute
        const shouldChangeWeather = 
          (prev.timeOfDay !== newTimeOfDay) && 
          (newTimeOfDay === 'day') && 
          (Math.random() > 0.7);
          
        const weathers: ['sunny', 'rainy', 'windy', 'cosmic'] = ['sunny', 'rainy', 'windy', 'cosmic'];
        const newWeather = shouldChangeWeather 
          ? weathers[Math.floor(Math.random() * weathers.length)]
          : prev.weather;
          
        // Apply weather effects
        let layers = { ...prev.layers };
        let co2Captured = prev.co2Captured;
        
        if (shouldChangeWeather) {
          if (newWeather === 'rainy') {
            // Rainy weather boosts tree growth
            layers.surface = layers.surface.map(el => {
              if (el.type === 'tree') {
                return {
                  ...el,
                  age: el.age + 5,
                  mature: el.age + 5 >= (prev.biome === 'tropical' ? 60 : 70)
                };
              }
              return el;
            });
            
            setNotification({
              show: true,
              message: '🌧️ A chuva nutre suas árvores!',
              type: 'bonus'
            });
          } else if (newWeather === 'windy') {
            // Wind spreads seeds
            setNotification({
              show: true,
              message: '🌬️ O vento espalha novas sementes!',
              type: 'bonus'
            });
          } else if (newWeather === 'cosmic') {
            // Cosmic energy boosts stellar energy
            const newStars: EcosystemElement[] = [];
            for (let i = 0; i < 3; i++) {
              const id = `star-${Date.now()}-${i}`;
              const newStar = {
                id,
                type: 'star',
                x: Math.random() * 800,
                y: Math.random() * 100,
                size: 2 + Math.random() * 3,
                age: 0
              };
              newStars.push(newStar);
            }
            
            layers.sky = [...layers.sky, ...newStars];
            
            setNotification({
              show: true,
              message: '✨ Energia cósmica fortalece o ecossistema!',
              type: 'bonus'
            });
          }
        }
        
        // Trees capture CO2 over time
        const matureTrees = layers.surface.filter(el => el.type === 'tree' && el.mature);
        if (matureTrees.length > 0) {
          co2Captured += matureTrees.length * 0.05; // 0.05kg per mature tree per cycle
        }
        
        return {
          ...prev,
          timeOfDay: newTimeOfDay,
          weather: newWeather,
          layers,
          co2Captured
        };
      });
    }, 1000); // Update every second
    
    return () => clearInterval(gameCycleInterval);
  }, []);
  
  // Process donation and create ecosystem elements
  const handleDonate = (amount: number) => {
    if (amount < 7) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Calculate rewards
      const rewardsResult = rewardSystem.calculateRewards(amount, {
        level,
        experience,
        nextLevelExp,
        treeCount,
        badges,
        donations,
        co2Captured: ecosystem.co2Captured,
        totalDonated,
        resources: ecosystem.resources
      });
      
      // Update game state
      const newExp = experience + rewardsResult.experience;
      let newLevel = level;
      let newNextLevelExp = nextLevelExp;
      
      // Level up if enough experience
      if (newExp >= nextLevelExp) {
        newLevel = level + 1;
        newNextLevelExp = getNextLevelExp(newLevel);
      }
      
      setExperience(newExp);
      setLevel(rewardsResult.leveledUp ? newLevel : level);
      setNextLevelExp(rewardsResult.leveledUp ? newNextLevelExp : nextLevelExp);
      setTotalDonated(totalDonated + amount);
      setDonations(donations + 1);
      
      // Create ecosystem elements based on donation
      const newElements: EcosystemElement[] = [];
      let remaining = amount;
      const biome = ecosystem.biome;
      
      // Each R$7 = 1 tree
      const newTreeCount = Math.floor(remaining / 7);
      setTreeCount(treeCount + newTreeCount);
      
      // Create trees
      for (let i = 0; i < newTreeCount; i++) {
        const id = `tree-${Date.now()}-${i}`;
        const x = 100 + Math.random() * 600;
        const y = 350; // At ground level
        
        // Create tree
        newElements.push({
          id,
          type: 'tree',
          x,
          y,
          size: 0, // Start small and grow
          age: 0,
          mature: false
        });
        
        remaining -= 7;
      }
      
      // Handle large donations - add water bodies or animals
      if (amount >= 50 && Math.random() > 0.5) {
        const id = `water-${Date.now()}`;
        const x = 100 + Math.random() * 600;
        const y = 350;
        
        newElements.push({
          id,
          type: biome === 'tropical' ? 'river' : 'lake',
          x,
          y,
          size: 0,
          age: 0
        });
      }
      
      if (amount >= 20 && Math.random() > 0.5) {
        const id = `animal-${Date.now()}`;
        const x = 100 + Math.random() * 600;
        const y = 350;
        
        newElements.push({
          id,
          type: 'animal',
          x,
          y,
          size: 0,
          age: 0,
          color: biome === 'tropical' ? '#ff4500' : '#8b4513'
        });
      }
      
      // Add stars/energy occasionally
      if (Math.random() > 0.7) {
        const starCount = Math.floor(amount / 10);
        for (let i = 0; i < starCount; i++) {
          const id = `star-${Date.now()}-${i}`;
          const x = Math.random() * 800;
          const y = Math.random() * 100;
          
          ecosystem.layers.sky.push({
            id,
            type: 'star',
            x,
            y,
            size: 2 + Math.random() * 3,
            age: 0
          });
        }
      }
      
      // Update ecosystem state
      setEcosystem(prev => {
        // Calculate CO2 capture (22kg per tree on average)
        const newCO2 = prev.co2Captured + (newTreeCount * 22);
        
        return {
          ...prev,
          layers: {
            surface: [...prev.layers.surface, ...newElements],
            sky: [...prev.layers.sky]
          },
          totalElements: prev.totalElements + newElements.length,
          resources: {
            wood: prev.resources.wood + (newTreeCount * 5),
            water: prev.resources.water + (newElements.some(e => e.type === 'river' || e.type === 'lake') ? 20 : 0),
            stellarEnergy: prev.resources.stellarEnergy + rewardsResult.stellarEnergy
          },
          co2Captured: newCO2
        };
      });
      
      // Update badges
      setBadges(rewardSystem.getUnlockedBadges({
        treeCount: treeCount + newTreeCount,
        donations: donations + 1,
        badges,
        level: rewardsResult.leveledUp ? newLevel : level,
        co2Captured: ecosystem.co2Captured + (newTreeCount * 22),
        totalDonated: totalDonated + amount,
        resources: {
          ...ecosystem.resources,
          stellarEnergy: ecosystem.resources.stellarEnergy + rewardsResult.stellarEnergy
        }
      }));
      
      // Show rewards if any
      if (rewardsResult.rewards.length > 0) {
        const firstReward = rewardsResult.rewards[0];
        setCurrentReward({
          show: true,
          title: firstReward.title,
          description: firstReward.description,
          type: firstReward.type,
          badgeType: firstReward.badgeType
        });
        
        // Queue additional rewards
        if (rewardsResult.rewards.length > 1) {
          let rewardIndex = 1;
          const showNextReward = () => {
            if (rewardIndex < rewardsResult.rewards.length) {
              const nextReward = rewardsResult.rewards[rewardIndex];
              setCurrentReward({
                show: true,
                title: nextReward.title,
                description: nextReward.description,
                type: nextReward.type,
                badgeType: nextReward.badgeType
              });
              rewardIndex++;
            }
          };
          
          // Set up reward chain
          const rewardChain = setInterval(() => {
            if (!currentReward.show) {
              showNextReward();
              if (rewardIndex >= rewardsResult.rewards.length) {
                clearInterval(rewardChain);
              }
            }
          }, 1000);
        }
      } else {
        // If no special rewards, show a simple thank you notification
        setNotification({
          show: true,
          message: `Obrigado pela doação de R$${amount.toFixed(2)}!`,
          type: 'bonus'
        });
      }
      
      setLoading(false);
    }, 1500);
  };
  
  // Handle biome change
  const handleBiomeChange = (newBiome: Biome) => {
    setEcosystem(prev => ({
      ...prev,
      biome: newBiome as Biome
    }));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero section */}
      <header className="pt-16 pb-10 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-eco-forest opacity-20 dark:opacity-40 -z-10"></div>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-500 text-transparent bg-clip-text">
            Ecossistema Vivo
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Sua doação planta árvores reais e virtuais. Acompanhe o crescimento do seu impacto e ganhe recompensas!
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ecosystem canvas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Layer selector */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`flex-1 py-3 text-sm font-medium ${activeLayer === 'surface' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-green-500'}`}
                  onClick={() => setActiveLayer('surface')}
                >
                  <TreePine className="w-4 h-4 inline-block mr-1" /> Superfície
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-medium ${activeLayer === 'sky' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-green-500'}`}
                  onClick={() => setActiveLayer('sky')}
                >
                  <Sparkles className="w-4 h-4 inline-block mr-1" /> Céu
                </button>
              </div>
              
              {/* Ecosystem visualization */}
              <EcosystemCanvas 
                ecosystem={ecosystem} 
                setEcosystem={setEcosystem} 
                activeLayer={activeLayer}
                onElementClick={() => {
                  // May add interaction with elements
                }}
              />
            </div>
            
            {/* Statistics panel */}
            <StatisticsPanel
              treeCount={treeCount}
              co2Captured={ecosystem.co2Captured}
              stellarEnergy={ecosystem.resources.stellarEnergy}
              level={level}
              experience={experience}
              nextLevelExp={nextLevelExp}
              badges={badges}
            />
            
            {/* Guardian message */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
              <div className="mr-3 mt-1 bg-green-100 dark:bg-green-800 rounded-full p-2">
                <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-300">Lyra, a Guardiã</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  {treeCount === 0 
                    ? "Olá guardião! Faça sua primeira doação para começar a transformar o planeta."
                    : ecosystem.weather === 'rainy'
                      ? "A chuva está nutrindo suas árvores! Elas crescem mais rápido agora."
                      : ecosystem.weather === 'cosmic'
                        ? "Energias cósmicas estão fortalecendo seu ecossistema! Uma ótima hora para doar."
                        : `Você já plantou ${treeCount} árvores e capturou ${ecosystem.co2Captured.toFixed(1)}kg de CO₂. Continue o ótimo trabalho!`
                  }
                </p>
              </div>
            </div>
          </div>
          
          {/* Donation panel */}
          <div className="lg:col-span-1">
            <DonationPanel
              minDonation={7}
              onDonate={handleDonate}
              biome={ecosystem.biome}
              onBiomeChange={handleBiomeChange}
              loading={loading}
            />
          </div>
        </div>
      </main>
      
      {/* About section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sobre o EcoVivo</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            O EcoVivo conecta sua generosidade à preservação ambiental. Cada doação financia 
            projetos reais de reflorestamento, enquanto você acompanha o crescimento de um 
            ecossistema virtual. Juntos, restauramos o planeta!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reflorestamento</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ajudamos a plantar árvores nativas em áreas degradadas, restaurando a biodiversidade local.
              </p>
            </div>
            
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Preservação da Água</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Protegemos nascentes e cursos d'água, garantindo ecossistemas saudáveis e água limpa.
              </p>
            </div>
            
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Educação Ambiental</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Promovemos a conscientização sobre a importância da preservação ambiental e sustentabilidade.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Reward popup */}
      {currentReward.show && (
        <RewardPopup
          showReward={currentReward.show}
          rewardTitle={currentReward.title}
          rewardDescription={currentReward.description}
          rewardType={currentReward.type}
          badgeType={currentReward.badgeType}
          onClose={() => setCurrentReward({ ...currentReward, show: false })}
        />
      )}
      
      {/* Notification */}
      {notification.show && (
        <RewardNotification
          message={notification.message}
          type={notification.type}
        />
      )}
    </div>
  );
};

export default Index;
