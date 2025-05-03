
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface DonationPanelProps {
  minDonation: number;
  onDonate: (amount: number) => void;
  biome: string;
  onBiomeChange: (biome: string) => void;
  loading?: boolean;
}

const predefinedAmounts = [7, 15, 30, 50, 100];

export function DonationPanel({ 
  minDonation, 
  onDonate, 
  biome, 
  onBiomeChange,
  loading = false
}: DonationPanelProps) {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [expandedInfo, setExpandedInfo] = useState(false);
  
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (/^\d*\.?\d{0,2}$/.test(value) && !isNaN(parseFloat(value)))) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };
  
  const handleDonate = () => {
    const donationAmount = selectedAmount || parseFloat(customAmount);
    if (donationAmount && donationAmount >= minDonation) {
      onDonate(donationAmount);
      // Reset form after successful donation
      setSelectedAmount(null);
      setCustomAmount('');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 p-4 text-white relative">
        <div className="flex items-center justify-center space-x-2">
          <Heart className="h-5 w-5 animate-pulse-grow" />
          <h2 className="text-xl font-bold">Doe para Preservar</h2>
        </div>
        <p className="text-center text-white/80 text-sm mt-1">
          Sua doação planta árvores reais e traz recompensas virtuais
        </p>
      </div>
      
      {/* Body */}
      <div className="p-4">
        {/* Biome selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Escolha o bioma para restaurar
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                "relative border rounded-lg p-3 cursor-pointer transition-all",
                biome === 'tropical' 
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                  : "border-gray-200 hover:border-green-200 dark:border-gray-700"
              )}
              onClick={() => onBiomeChange('tropical')}
            >
              <div className="h-20 bg-gradient-to-b from-green-400 to-yellow-300 rounded mb-2"></div>
              <h3 className="font-medium">Floresta Tropical</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rica em biodiversidade</p>
              {biome === 'tropical' && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div
              className={cn(
                "relative border rounded-lg p-3 cursor-pointer transition-all",
                biome === 'temperate' 
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                  : "border-gray-200 hover:border-green-200 dark:border-gray-700"
              )}
              onClick={() => onBiomeChange('temperate')}
            >
              <div className="h-20 bg-gradient-to-b from-yellow-100 to-green-500 rounded mb-2"></div>
              <h3 className="font-medium">Floresta Temperada</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Estações bem definidas</p>
              {biome === 'temperate' && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          </div>
        </div>
        
        {/* Information panel (expandable) */}
        <div 
          className={cn(
            "mb-4 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden transition-all duration-300",
            expandedInfo ? "max-h-[500px]" : "max-h-10"
          )}
        >
          <div 
            className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 cursor-pointer"
            onClick={() => setExpandedInfo(!expandedInfo)}
          >
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">O que sua doação realiza?</span>
            <span>{expandedInfo ? '▲' : '▼'}</span>
          </div>
          
          <div className="p-3 text-sm text-gray-600 dark:text-gray-300">
            <p className="mb-2">Cada R$7 doados equivalem a 1 árvore plantada em projetos reais de reflorestamento.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>R$7 = 1 árvore = ~22kg de CO₂ capturados</li>
              <li>R$50 = Lago ou rio virtual + 7 árvores</li>
              <li>R$20 = Vida selvagem virtual + 2 árvores</li>
              <li>Toda doação dá XP e chance de recompensas especiais</li>
            </ul>
            <p className="mt-2 text-xs italic">Parcerias com ONGs garantem que sua doação chegue diretamente aos projetos de reflorestamento.</p>
          </div>
        </div>
        
        {/* Donation amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Escolha o valor da doação (mín. R${minDonation})
          </label>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            {predefinedAmounts.map(amount => (
              <button
                key={`amount-${amount}`}
                className={cn(
                  "py-2 px-1 rounded border font-medium transition-all",
                  selectedAmount === amount 
                    ? "bg-green-500 text-white border-green-600" 
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                )}
                onClick={() => handleAmountSelect(amount)}
              >
                R${amount}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="text"
              placeholder="Outro valor"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full px-8 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        {/* Donate button */}
        <button
          className={cn(
            "w-full py-3 px-4 rounded-lg font-semibold text-white transition-all",
            (selectedAmount || (customAmount && parseFloat(customAmount) >= minDonation))
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-gray-400 cursor-not-allowed",
            loading && "opacity-70 cursor-wait"
          )}
          onClick={handleDonate}
          disabled={loading || (!selectedAmount && (!customAmount || parseFloat(customAmount) < minDonation))}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : "Contribuir Agora"}
        </button>
        
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Doações seguras via plataformas certificadas
        </p>
      </div>
    </div>
  );
}
