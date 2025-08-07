import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './M1Q2Scene.module.css';
import QuizResultPopup from './QuizResultPopup';
import ProgressBar from './ProgressBar';

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
      <div className={`${styles.notificationBar} ${isVisible ? styles.slideIn : ''} w-full bg-red-600 text-white p-3 lg:p-2 fixed top-0 left-0 right-0 z-20`}>
        <div className="max-w-md lg:max-w-6xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-1.5 lg:p-1 rounded-full flex-shrink-0">
              <span className="text-lg lg:text-xl">🖐️</span>
            </div>
            <p className="text-sm lg:text-xs font-medium flex-1 text-left">
              Pertanyaan selanjutnya dari Klien nih! Jawab dengan yang kamu tahu dulu. Tenang, ada bantuan kok. 😉
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex items-center justify-center p-4 pt-20 lg:pt-16 pb-32 lg:pb-24">
        {/* Mobile Layout - Single Column */}
        <div className="lg:hidden bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md">
          <p className="text-gray-800 text-base sm:text-lg mb-4 text-left font-medium">
            Oke, mengerti. Lalu, gini nih, kalau ada pelanggan yang lagi cari &apos;kopi enak&apos; atau &apos;bunga segar&apos; di internet. Menurut Kamu, cara apa yang paling jitu biar kafe kami langsung mudah ditemukan di internet?
          </p>

          <div className="flex flex-col gap-3 sm:gap-4">
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

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex w-full max-w-6xl gap-6 h-full max-h-[calc(100vh-8rem)]">
          {/* Left Side - Question */}
          <div className="w-1/2 bg-white bg-opacity-50 rounded-xl shadow p-4 flex flex-col justify-center">
            <p className="text-black text-base xl:text-lg text-left leading-relaxed">
              Oke, mengerti. Lalu, gini nih, kalau ada pelanggan yang lagi cari &apos;kopi enak&apos; atau &apos;bunga segar&apos; di internet. Menurut Kamu, cara apa yang paling jitu biar kafe kami langsung mudah ditemukan di internet?
            </p>
          </div>

          {/* Right Side - Answer Choices */}
          <div className="w-1/2 bg-white rounded-xl shadow-2xl p-4 flex flex-col">
            <div className="flex flex-col gap-3 flex-1 justify-center">
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
                  className={`p-3 rounded-xl text-left transition-all duration-200 w-full text-sm shadow-md transform hover:scale-105 ${
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
      </div>
        
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FFDE3D] z-10">
        <div className="w-full max-w-6xl mx-auto p-3 lg:p-2">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-row gap-4 w-full max-w-md">
              <button 
                onClick={onBack}
                className="h-10 lg:h-12 w-10 lg:w-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center flex-none"
              >
                <FaArrowLeft className="w-3 lg:w-4 h-3 lg:h-4" />
              </button>
              <button 
                onClick={handleNext}
                disabled={selectedOption !== 'search-ads'}
                className={`flex-1 h-10 lg:h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                  selectedOption === 'search-ads' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Selanjutnya
                <FaArrowRight className="w-3 lg:w-4 h-3 lg:h-4" />
              </button>
            </div>
            <div className="w-full max-w-md mt-1 lg:mt-2">
              <ProgressBar current={2} total={3} />
            </div>
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
