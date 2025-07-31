import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './M2Q4Scene.module.css';


import { correctAnswers } from '@/lib/answers';

interface M2Q4SceneProps {
  userName: string;
  onBack: () => void;
  onNext: (score: number) => void;
}

const M2Q4Scene: React.FC<M2Q4SceneProps> = ({ userName, onBack, onNext }) => {
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
    const score = (selectedOption === correctAnswers.M2Q4) ? 1 : 0;
    onNext(score);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Animated notification bar */}
      <div className={`${styles.notificationBar} ${isVisible ? styles.slideInM2Q4 : ''} w-full bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-20`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-full flex-shrink-0">
              <span className="text-xl sm:text-2xl">😉</span>
            </div>
            <p className="text-base font-medium flex-1 text-left">
              Masih semangat kan? Jangan takut salah, kamu pasti bisa!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-md mx-auto flex flex-col px-4 pt-24 pb-24 overflow-y-auto">
        <div className="w-full">
          <div className="relative w-full h-48 sm:h-64 mb-4 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/table2.png"
              alt="Email Open Rate Data Table"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          
          <p className="text-gray-800 text-base sm:text-lg mb-4 font-medium">
            Saya juga punya data ini. Menurut kamu, kapan waktu paling tepat untuk mengirim email promosi?
          </p>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {[
              { id: 'time-1', text: '09:00 - 11:00' },
              { id: 'time-2', text: '11:30 - 13:30' },
              { id: 'time-3', text: '16:00 - 19.00' },
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
      </div>

      {/* Bottom Navigation */}
      <div className="w-full max-w-md mx-auto p-4 z-10 bg-[#FFDE3D] fixed bottom-0 left-0 right-0">
        <div className="flex flex-row gap-4 w-full">
          <button 
            onClick={onBack}
            className="h-12 w-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center flex-none shadow-md">
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            disabled={!selectedOption}
            className={`flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md ${selectedOption ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}>
            Selanjutnya
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default M2Q4Scene;
