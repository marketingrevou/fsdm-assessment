import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './M1Q1Scene.module.css';
import QuizResultPopup from './QuizResultPopup';
import ProgressBar from './ProgressBar';

interface M1Q1SceneProps {
  onBack: () => void;
  onNext: (selectedOption: string | null) => void;
}

const M1Q1Scene: React.FC<M1Q1SceneProps> = ({ onBack, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Trigger the slide-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = (optionId: string) => {
    if (isSubmitting) return;
    
    setSelectedOption(optionId);
    setIsSubmitting(true);
    
    if (optionId === 'instagram') {
      setShowPopup('correct');
    } else {
      setShowPopup('wrong');
      // Auto-hide wrong answer popup after 2 seconds
      setTimeout(() => {
        setShowPopup('none');
        setIsSubmitting(false);
        setSelectedOption(null);
      }, 2000);
    }
  };

  const handleNext = () => {
    if (selectedOption === 'instagram') {
      onNext(selectedOption);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Animated notification bar */}
      <div className={`${styles.notificationBar} ${isVisible ? styles.slideIn : ''} w-full bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-20`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-full flex-shrink-0">
              <span className="text-xl sm:text-2xl">🖐️</span>
            </div>
            <p className="text-sm font-medium flex-1 text-left">
              Semangat! Jangan takut salah, selamat mengerjakan!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full flex items-center justify-center p-4 pt-24">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg w-full max-w-md">
          <p className="text-gray-800 text-base sm:text-lg mb-4 text-center font-medium">
            Kami punya banyak foto dan video produk yang bagus-bagus nih di Kafe Kami.
          </p>

          <div className="relative w-full h-48 sm:h-64 mb-4 rounded-xl overflow-hidden bg-gray-100">
            <Image
              src="/M1Q1/img13.png"
              alt="Cafe Products"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          <p className="text-gray-800 text-base sm:text-lg mb-4 text-center font-medium">
            Media Sosial mana sih yang paling cocok buat kami pamer foto dan video yang indah ini?
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'instagram', name: 'Instagram', logo: '/M1Q1/Instagram_icon.png' },
              { id: 'linkedin', name: 'LinkedIn', logo: '/M1Q1/LinkedIn_logo_initials.png' },
              { id: 'pinterest', name: 'Pinterest', logo: '/M1Q1/Pinterest-logo.png' },
              { id: 'x-twitter', name: 'X (Twitter)', logo: '/M1Q1/X_logo.png' }
            ].map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleAnswer(platform.id)}
                disabled={isSubmitting}
                className={`p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center transition-all duration-200 shadow-md transform hover:scale-105 ${
                  selectedOption === platform.id
                    ? platform.id === 'instagram'
                      ? 'ring-2 ring-green-500 bg-green-50'
                      : 'ring-2 ring-red-500 bg-red-50'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${isSubmitting && selectedOption !== platform.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-2">
                  <Image
                    src={platform.logo}
                    alt={platform.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
        
      {/* Bottom Navigation */}
      <div className="w-full max-w-md mx-auto p-4 z-10 bg-[#FFDE3D]">
                <div className="flex flex-col items-center w-full">
          <div className="flex flex-row gap-4 w-full">
          <button
            onClick={onBack}
            className="h-12 w-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center flex-none shadow-md"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={selectedOption !== 'instagram'}
            className={`flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md ${
              selectedOption === 'instagram'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Selanjutnya
            <FaArrowRight className="w-4 h-4" />
          </button>
          </div>
          <div className="w-full lg:max-w-md mt-2">
            <ProgressBar current={1} total={3} />
          </div>
        </div>
      </div>

      <QuizResultPopup isVisible={showPopup !== 'none'} onClose={() => setShowPopup('none')}>
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
          {showPopup === 'correct' ? (
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src="/GIF/ezgif.com-animated-gif-maker-8.gif"
                  alt="Correct Answer Illustration"
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kerja Bagus!</h3>
              <p className="text-gray-600 mb-6">
                Tepat sekali! Instagram adalah tempat terbaik untuk menampilkan foto dan video.
              </p>
              <button
                onClick={handleNext}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Lanjut <FaArrowRight />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-red-500 font-bold text-lg mb-4">
                Oops, coba lagi ya!
              </p>
              <p className="text-gray-600">
                Sepertinya itu bukan jawaban yang paling tepat. Pikirkan platform mana yang fokus pada visual.
              </p>
            </div>
          )}
        </div>
      </QuizResultPopup>
    </div>
  );
};

export default M1Q1Scene;
