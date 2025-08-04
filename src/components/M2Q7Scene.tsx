import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';


import { correctAnswers } from '@/lib/answers';

interface M2Q7SceneProps {
  userName: string;
  onBack: () => void;
  onNext: (score: number) => void;
}

const M2Q7Scene: React.FC<M2Q7SceneProps> = ({ onBack, onNext }) => {
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
      <div className="w-full bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-full flex-shrink-0">
              <span className="text-xl sm:text-2xl">📸</span>
            </div>
            <p className="text-base font-medium flex-1 text-left">
              Ingat foto sebelumnya? Itu adalah pentunjuk untuk jawab soal ini. 😉
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-md mx-auto flex flex-col px-4 pt-24 pb-24 overflow-y-auto">
        <div className="w-full">
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
      </div>

      {/* Bottom Navigation */}
      <div className="w-full max-w-md mx-auto p-4 z-10 bg-[#FFDE3D] fixed bottom-0 left-0 right-0">
        <div className="flex flex-row justify-center w-full">
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

export default M2Q7Scene;
