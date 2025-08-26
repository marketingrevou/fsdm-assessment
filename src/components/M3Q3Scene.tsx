import React, { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './M3Q3Scene.module.css';
import { saveM3Q3Feedback } from '@/app/actions/scoreActions';
import Cookies from 'js-cookie';
import ProgressBar from './ProgressBar';

interface M3Q3SceneProps {
  userName: string;
  onBack: () => void;
  onNext: () => void;
}

const M3Q3Scene: React.FC<M3Q3SceneProps> = ({ onBack, onNext }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);
  const [showError, setShowError] = useState(false);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNotificationVisible(false);
    }, 5000); // Hide after 5 seconds
    
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    if (!feedback.trim()) {
      setShowError(true);
      return;
    }
    
    startTransition(async () => {
      await saveM3Q3Feedback(feedback);
      // Don't remove cookies here - ClosingScene needs them to fetch scores
      onNext();
    });
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Animated notification bar */}
      <div className={`${styles.notificationBar} ${isNotificationVisible ? styles.slideInM3Q3 : styles.slideOutM3Q3} w-full bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-20 transition-transform duration-500 ease-in-out`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-full flex-shrink-0">
              <span className="text-xl sm:text-2xl">🥲</span>
            </div>
            <p className="text-base font-medium flex-1 text-left">
              Misi selesai! Sebelum kita berpisah, aku mau lebih kenal tentang kamu dong.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-grow w-full overflow-y-auto transition-all duration-500 ${isNotificationVisible ? 'pt-32' : 'pt-4'} pb-4`}>
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden w-full max-w-md mx-auto px-4">
          <div className="w-full bg-white rounded-2xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">Selamat!</h1>
            
            <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden">
              <Image
                src="/GIF/ezgif.com-animated-gif-maker-14.gif"
                alt="Celebration Animation"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
            
            <p className="text-gray-800 text-base sm:text-lg mb-4 font-medium">
            Tuliskan secara singkat kenapa kamu tertarik belajar Digital Marketing. Kamu dapat membagikan pengalaman belajar/kerja/organisasi yang pernah kamu jalani sebelumnya, ataupun tujuan yang ingin kamu capai.
            </p>
            
            <div className="mb-2">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 transition-shadow"
                rows={4}
                placeholder="Mohon tulis minimal 100 kata tanpa menggunakan AI."
              />
              <div className="flex justify-between items-center mt-1">
                {showError && !feedback.trim() && (
                  <p className="text-red-500 text-xs">Boleh diisi dulu ya sebelum lanjut 😉 </p>
                )}
                <div className="text-sm text-gray-500 ml-auto">
                  {feedback.length} karakter
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex lg:items-center lg:justify-center w-full px-4 xl:px-6 h-full">
          <div className="max-w-5xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 lg:gap-4 xl:gap-6 lg:items-center h-full">
              {/* Selamat + Image Section - Left */}
              <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl xl:text-3xl font-bold mb-4 text-gray-800">Selamat!</h1>
                
                <div className="relative w-full max-w-xs xl:max-w-sm aspect-square rounded-xl overflow-hidden">
                  <Image
                    src="/GIF/ezgif.com-animated-gif-maker-14.gif"
                    alt="Celebration Animation"
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                </div>
              </div>
              
              {/* Question + Textbox Section - Right */}
              <div className="flex items-center justify-center">
                <div className="bg-white rounded-2xl p-5 xl:p-6 shadow-lg w-full max-w-md">
                  <p className="text-base xl:text-lg text-black text-center leading-relaxed font-medium mb-6">
                  Tuliskan secara singkat kenapa kamu tertarik belajar Digital Marketing. Kamu dapat membagikan pengalaman belajar/kerja/organisasi yang pernah kamu jalani sebelumnya, ataupun tujuan yang ingin kamu capai.
                  </p>
                  
                  <div className="space-y-2">
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 transition-shadow text-sm xl:text-base h-24 xl:h-28 resize-none"
                      placeholder="Mohon tulis minimal 100 kata tanpa menggunakan AI."
                    />
                    <div className="flex justify-between items-center">
                      {showError && !feedback.trim() && (
                        <p className="text-red-500 text-xs">Harap isi alasan Anda sebelum melanjutkan</p>
                      )}
                      <div className="text-xs xl:text-sm text-gray-500 ml-auto">
                        {feedback.length} karakter
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            disabled={!feedback.trim()}
            className={`flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md ${feedback.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}>
            Selanjutnya
            <FaArrowRight className="w-4 h-4" />
          </button>
          </div>
          <div className="w-full lg:max-w-md mt-2">
            <ProgressBar current={3} total={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default M3Q3Scene;
