import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './M1Q2Scene.module.css';
import QuizResultPopup from './QuizResultPopup';

interface M1Q2SceneProps {
  onBack: () => void;
  onNext: (selectedOption: string | null) => void;
}

const M1Q2Scene: React.FC<M1Q2SceneProps> = ({ onBack, onNext }) => {
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
    
    if (optionId === 'search-ads') {
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
    if (selectedOption === 'search-ads') {
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
              Pertanyaan selanjutnya dari Klien nih! Jawab dengan yang kamu tahu dulu. Tenang, ada bantuan kok. 😉
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-md mx-auto flex flex-col pt-20 px-4 pb-4 overflow-y-auto">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex-grow flex flex-col">
          <p className="text-gray-800 text-base sm:text-lg mb-4 text-left font-medium">
            Oke, mengerti. Lalu, gini nih, kalau ada pelanggan yang lagi cari &apos;kopi enak&apos; atau &apos;bunga segar&apos; di internet. Menurut Kamu, cara apa yang paling jitu biar kafe kami langsung mudah ditemukan di internet?
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 mt-auto">
            {[
              { id: 'social-media', text: 'Rajin posting foto dan video di Instagram atau Facebook.' },
              { id: 'email', text: 'Kirim info terbaru lewat email ke pelanggan.' },
              { id: 'influencer', text: 'Ajak selebriti internet (influencer) buat bikin konten.' },
              { id: 'search-ads', text: 'Pasang iklan khusus di mesin pencari (seperti Google Search Ads, biar muncul paling atas).' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={isSubmitting}
                className={`p-3 sm:p-4 rounded-xl text-left transition-all duration-200 w-full text-sm sm:text-base shadow-md transform hover:scale-105 ${
                  selectedOption === option.id
                    ? option.id === 'search-ads'
                      ? 'ring-2 ring-green-500 bg-green-50'
                      : 'ring-2 ring-red-500 bg-red-50'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${isSubmitting && selectedOption !== option.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-medium text-gray-800">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
        
      {/* Bottom Navigation */}
      <div className="w-full max-w-md mx-auto p-4 z-10 bg-[#FFDE3D]">
        <div className="flex flex-row gap-4 w-full">
          <button 
            onClick={onBack}
            className="h-12 w-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center flex-none shadow-md"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            disabled={selectedOption !== 'search-ads'}
            className={`flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md ${
              selectedOption === 'search-ads' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Selanjutnya
            <FaArrowRight className="w-4 h-4" />
          </button>
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
                  layout="fill"
                  objectFit="contain"
                  unoptimized
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kerja Bagus!</h3>
              <p className="text-gray-600 mb-6">
                Tepat sekali! Google Search Ads adalah channel terbaik untuk memastikan brand kita tampil di hasil pencarian Google. Channel ini sering dipakai agar Brand berada di urutan pertama hasil pencarian dari kata / keyword yang disasar.
              </p>
              <button
                onClick={handleNext}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Selanjutnya <FaArrowRight />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-red-500 font-bold text-lg mb-4">
                Oops, coba lagi ya!
              </p>
              <p className="text-gray-600">
                Coba ingat-ingat, dimana orang sering melakukan pencarian secara text?
              </p>
            </div>
          )}
        </div>
      </QuizResultPopup>
    </div>
  );
};

export default M1Q2Scene;
