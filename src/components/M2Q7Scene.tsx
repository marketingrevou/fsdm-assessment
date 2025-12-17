import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ProgressBar from './ProgressBar';


import { correctAnswers } from '@/lib/answers';

interface M2Q7SceneProps {
  userName: string;
  onBack: () => void;
  onNext: (score: number) => void;
}

const M2Q7Scene: React.FC<M2Q7SceneProps> = ({ userName, onBack, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // Removed unused state and effect

  const handleAnswer = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    const score = (selectedOption === correctAnswers.M2Q7) ? 1 : 0;
    onNext(score);
  };

  const options = [
    { id: 'A', imgSrc: '/img6.png' },
    { id: 'B', imgSrc: '/img7.png' },
    { id: 'C', imgSrc: '/img8.png' },
    { id: 'D', imgSrc: '/img9.png' },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Animated notification bar */}
      <div className="w-full bg-red-600 text-white p-3 lg:p-2 fixed top-0 left-0 right-0 z-20">
        <div className="max-w-md lg:max-w-6xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-1.5 lg:p-1 rounded-full flex-shrink-0">
              <span className="text-lg lg:text-xl">📸</span>
            </div>
            <p className="text-sm lg:text-xs font-medium flex-1 text-left">
              Ingat foto sebelumnya? Itu adalah pentunjuk untuk jawab soal ini. 😉
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex items-center justify-center p-4 pt-20 lg:pt-16 pb-32 lg:pb-24">
        {/* Mobile Layout - 2x2 Grid */}
        <div className="lg:hidden w-full max-w-md mx-auto flex flex-col overflow-y-auto">
          <p className="text-gray-800 text-base sm:text-lg mb-4 font-medium text-left">
            Oh begitu ya, nah ini ada beberapa ide lagi dari tim kami. Berdasarkan data sebelumnya, Foto mana yang kamu sarankan untuk selanjutnya kami posting?
          </p>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`rounded-xl text-left transition-all duration-200 cursor-pointer aspect-square ${selectedOption === option.id ? 'ring-2 ring-red-500 shadow-lg' : 'shadow-md'}`}>
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={option.imgSrc}
                    alt={`Option ${option.id}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Single Row */}
        <div className="hidden lg:flex w-full max-w-6xl gap-6 h-full max-h-[calc(100vh-8rem)] flex-col justify-center">
          <div className="text-center mb-6">
            <p className="text-black text-base xl:text-lg font-medium leading-relaxed">
              Oh begitu ya, nah ini ada beberapa ide lagi dari tim kami. Berdasarkan data sebelumnya, Foto mana yang kamu sarankan untuk selanjutnya kami posting?
            </p>
          </div>
          
          {/* Single Row Grid for Desktop */}
          <div className="grid grid-cols-4 gap-4">
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`rounded-xl transition-all duration-200 cursor-pointer aspect-square transform hover:scale-105 ${
                  selectedOption === option.id 
                    ? 'ring-4 ring-red-500 shadow-2xl' 
                    : 'shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={option.imgSrc}
                    alt={`Option ${option.id}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            ))}
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
              <ProgressBar current={7} total={7} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M2Q7Scene;
