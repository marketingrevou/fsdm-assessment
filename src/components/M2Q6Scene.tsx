import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight, FaHeart, FaComment } from 'react-icons/fa';
import styles from './M2Q6Scene.module.css';

import { correctAnswers } from '@/lib/answers';

interface M2Q6SceneProps {
  userName: string;
  onBack: () => void;
  onNext: (score: number) => void;
}

const M2Q6Scene: React.FC<M2Q6SceneProps> = ({ userName, onBack, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
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
    const score = (selectedOption === correctAnswers.M2Q6) ? 1 : 0;
    onNext(score);
  };

  const options = [
    { id: 'A', imgSrc: '/img4.png', likes: 50, comments: 100 },
    { id: 'B', imgSrc: '/img5.png', likes: 100, comments: 200 },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Animated notification bar */}
      <div className={`${styles.notificationBar} ${isVisible ? styles.slideInM2Q6 : ''} w-full bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-20`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-full flex-shrink-0">
              <span className="text-xl sm:text-2xl">🔍</span>
            </div>
            <p className="text-base font-medium flex-1 text-left">
              Mana nih yang lebih menarik menurut followers? Klik yang dicetak tebal untuk dapatkan petunjuk!⚠️ 
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-md mx-auto flex flex-col px-4 pt-24 pb-24 overflow-y-auto">
        <div className="w-full">
          <p className="text-gray-800 text-base sm:text-lg mb-4 font-medium text-left">
            Akun Instagram saya saat ini memiliki 1000 followers. Beberapa waktu lalu, tim saya pernah mem-posting 2 konten berikut dan memberikan data-nya ke saya. Konten mana yang memiliki <button onClick={() => setShowHint(true)} className="text-red-600 font-bold underline cursor-pointer">Engagement Rate</button> lebih baik?
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`p-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${selectedOption === option.id ? 'ring-2 ring-red-500 bg-red-100 shadow-lg' : 'bg-white hover:bg-gray-50 shadow-md'}`}>
                <div className="relative w-full h-48 mb-2 rounded-md overflow-hidden">
                  <Image
                    src={option.imgSrc}
                    alt={`Option ${option.id}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex justify-around items-center text-gray-700 p-2">
                  <div className="flex items-center gap-1.5">
                    <FaHeart className="text-red-500" />
                    <span className="text-sm font-semibold">{option.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaComment className="text-gray-500" />
                    <span className="text-sm font-semibold">{option.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hint Popup */}
      {showHint && (
        <div className="fixed inset-0 bg-[#FFDE3D] bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-sm w-full mx-auto">
            <p className="text-base sm:text-lg font-semibold mb-4 text-gray-800">Engagement Rate = (Likes + Comments) ÷ Followers x 100%</p>
            <button 
              onClick={() => setShowHint(false)}
              className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 shadow-md">
              Kembali
            </button>
          </div>
        </div>
      )}

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

export default M2Q6Scene;
