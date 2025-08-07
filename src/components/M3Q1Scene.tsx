import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ProgressBar from './ProgressBar';

interface M3Q1SceneProps {
  userName: string;
  onBack: () => void;
  onNext: () => void;
}

const M3Q1Scene: React.FC<M3Q1SceneProps> = ({ onBack, onNext }) => {
  // Array of speech bubble texts with markdown-style bold formatting
  const speechBubbles = [
    "Nah, jadi minggu depan kami mau membuat **Festival Mekar & Kopi Musim Semi** nih.",
    "Disana nanti anak-anak muda bisa menikmati kopi di tengah taman bunga.",
    "Ada festival musik, undian berhadiah dan lainnya supaya pengunjung meningkat!"
  ];

  // State to track visible bubbles
  const [visibleBubblesCount, setVisibleBubblesCount] = useState(0);
  
  // Auto-show bubbles with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleBubblesCount < speechBubbles.length) {
        setVisibleBubblesCount(prev => prev + 1);
      }
    }, 1500); // 1.5 second delay between bubbles
    
    return () => clearTimeout(timer);
  }, [visibleBubblesCount, speechBubbles.length]);

  // Handle next button click
  const handleNext = () => {
    if (visibleBubblesCount < speechBubbles.length) {
      setVisibleBubblesCount(prev => prev + 1);
    } else {
      onNext();
    }
  };

  // Handle back button click
  const handleBack = () => {
    if (visibleBubblesCount > 1) {
      setVisibleBubblesCount(prev => prev - 1);
    } else {
      onBack();
    }
  };

  // Helper function to render text with bold formatting
  const renderTextWithBold = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => 
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D]">
      {/* Header */}
      <div className="w-full p-4 flex justify-center sm:justify-start flex-shrink-0">
        <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
          <Image 
            src="/logorevou.png" 
            alt="RevoU Logo" 
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center w-full max-w-md mx-auto px-4 py-2 overflow-hidden">
        <div className="w-full flex-shrink-0">
          {/* Profile Picture */}
          <div className="mb-3 sm:mb-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-white/20 rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm">
              <Image
                src="/Ayu.png"
                alt="Ayu - Kafe Owner"
                width={80}
                height={80}
                className="rounded-full object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Speech Bubbles */}
          <div className="w-full space-y-2 sm:space-y-3 flex-shrink-0">
            {speechBubbles.map((text, index) => (
              <div
                key={index}
                className={`bg-white p-3 rounded-xl shadow-md relative transition-all duration-500 ease-out transform ${index < visibleBubblesCount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <p className="text-gray-800 text-xs sm:text-sm leading-tight font-medium">
                  {renderTextWithBold(text)}
                </p>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45" />
              </div>
            ))}
          </div>

        </div>
        
        {/* Character illustration */}
        <div className="flex-grow flex items-center justify-center min-h-0">
          <div className="relative w-full max-w-[140px] sm:max-w-[160px] mx-auto">
            <Image
              src="/GIF/ezgif.com-animated-gif-maker-6.gif"
              alt="Character speaking"
              width={140}
              height={140}
              className="mx-auto object-contain w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full max-w-md mx-auto p-3 bg-transparent flex-shrink-0">
                <div className="flex flex-col items-center w-full">
          <div className="flex flex-row gap-4 w-full">
          <button 
            onClick={handleBack}
            className="h-12 w-12 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center flex-none shadow-sm"
            aria-label="Kembali"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            className={`flex-1 h-12 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${visibleBubblesCount < speechBubbles.length ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            aria-label={visibleBubblesCount < speechBubbles.length ? 'Tunggu hingga semua pesan selesai' : 'Lanjut'}
          >
            {visibleBubblesCount < speechBubbles.length ? 'Mengetik...' : 'Lanjut'}
            {visibleBubblesCount >= speechBubbles.length && <FaArrowRight className="w-4 h-4" />}
          </button>
          </div>
          <div className="w-full lg:max-w-md mt-2">
            <ProgressBar current={1} total={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default M3Q1Scene;
