import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './M2Q3Scene.module.css';
import ProgressBar from './ProgressBar';


import { correctAnswers } from '@/lib/answers';

interface M2Q3SceneProps {
  userName: string;
  onBack: () => void;
  onNext: (score: number) => void;
}

const M2Q3Scene: React.FC<M2Q3SceneProps> = ({ userName, onBack, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    const score = (selectedOption === correctAnswers.M2Q3) ? 1 : 0;
    onNext(score);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-y-auto">
      {/* Animated notification bar */}
      <div className={`${styles.notificationBar} ${isVisible ? styles.slideInM2Q3 : ''} w-full bg-red-600 text-white p-3 lg:p-2 fixed top-0 left-0 right-0 z-20`}>
        <div className="max-w-md lg:max-w-6xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-1.5 lg:p-1 rounded-full flex-shrink-0">
              <span className="text-lg lg:text-xl">🕵️</span>
            </div>
            <p className="text-sm lg:text-xs font-medium flex-1 text-left">
              Lanjut! Coba temukan kesimpulan terbaik dari data yg diberikan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex items-start justify-center p-4 pt-20 lg:pt-16 pb-32 lg:pb-24 overflow-y-auto">
        {/* Mobile Layout - Single Column */}
        <div className="lg:hidden w-full max-w-md mx-auto flex flex-col">
          <div className="relative w-full h-48 sm:h-64 mb-4 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/table1.png"
              alt="Promotion Data Table"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          
          <p className="text-gray-800 text-base sm:text-lg mb-4 font-medium">
            Ini hasil 2 promosi yang saya lakukan. Saya ingin menambah biaya iklan 500,000, sebaiknya saya anggarkan ke Promosi A atau B agar keuntungan saya lebih tinggi?
          </p>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {[
              { id: 'promo-a-largest', text: 'Promosi A karena rata-rata biaya per pelanggan paling besar' },
              { id: 'promo-b-largest', text: 'Promosi B karena rata-rata biaya per pelanggan paling besar' },
              { id: 'promo-a-smallest', text: 'Promosi A karena rata-rata biaya per pelanggan paling kecil' },
              { id: 'promo-b-smallest', text: 'Promosi B karena rata-rata biaya per pelanggan paling kecil' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`p-3 sm:p-4 rounded-xl text-left transition-all duration-200 w-full ${selectedOption === option.id ? 'ring-2 ring-red-500 bg-red-100 shadow-md' : 'bg-white hover:bg-gray-50 shadow-sm'}`}>
                <span className="text-sm sm:text-base font-medium text-gray-800">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex w-full max-w-6xl gap-6 h-auto min-h-[calc(100vh-12rem)] py-4">
          {/* Left Side - Image */}
          <div className="w-1/2 flex flex-col justify-center">
            <div className="relative w-full h-full max-h-96 rounded-xl overflow-hidden bg-ffde3d bg-opacity-20">
              <Image
                src="/table1.png"
                alt="Promotion Data Table"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </div>

          {/* Right Side - Question and Options */}
          <div className="w-1/2 flex flex-col justify-center">
            <p className="text-black text-base xl:text-lg mb-6 font-medium leading-relaxed">
              Ini hasil 2 promosi yang saya lakukan. Saya ingin menambah biaya iklan 500,000, sebaiknya saya anggarkan ke Promosi A atau B agar keuntungan saya lebih tinggi?
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'promo-a-largest', text: 'Promosi A karena rata-rata biaya per pelanggan paling besar' },
                { id: 'promo-b-largest', text: 'Promosi B karena rata-rata biaya per pelanggan paling besar' },
                { id: 'promo-a-smallest', text: 'Promosi A karena rata-rata biaya per pelanggan paling kecil' },
                { id: 'promo-b-smallest', text: 'Promosi B karena rata-rata biaya per pelanggan paling kecil' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 w-full transform hover:scale-105 ${
                    selectedOption === option.id 
                      ? 'ring-2 ring-red-500 bg-red-100 bg-opacity-80 shadow-md' 
                      : 'bg-white bg-opacity-60 hover:bg-opacity-80 shadow-sm'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-800">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FFDE3D] z-10">
        <div className="w-full max-w-6xl mx-auto p-3 lg:p-2">
          <div className="flex flex-col items-center w-full">
            <button 
              onClick={handleNext}
              disabled={!selectedOption}
              className={`w-full max-w-md h-10 lg:h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md ${
                selectedOption ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Selanjutnya
              <FaArrowRight className="w-3 lg:w-4 h-3 lg:h-4" />
            </button>
            <div className="w-full max-w-md mt-1 lg:mt-2">
              <ProgressBar current={3} total={7} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M2Q3Scene;
