import React, { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './M3Q3Scene.module.css';
import { saveM3Q3Feedback } from '@/app/actions/scoreActions';
import Cookies from 'js-cookie';

interface M3Q3SceneProps {
  userName: string;
  onBack: () => void;
  onNext: () => void;
}

const M3Q3Scene: React.FC<M3Q3SceneProps> = ({ onBack, onNext }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const isVisible = true;
  const maxLength = 150;

  const handleNext = async () => {
    startTransition(async () => {
      await saveM3Q3Feedback(feedback);
      // Don't remove cookies here - ClosingScene needs them to fetch scores
      onNext();
    });
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Animated notification bar */}
      <div className={`${styles.notificationBar} ${isVisible ? styles.slideInM3Q3 : ''} w-full bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-20`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-full flex-shrink-0">
              <span className="text-xl sm:text-2xl">🥲</span>
            </div>
            <p className="text-base font-medium flex-1 text-left">
              Sebentar lagi kita berpisah, tapi aku mau lebih kenal tentang kamu dong.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center w-full max-w-md mx-auto px-4 pt-24 pb-4 overflow-y-auto">
        <div className="w-full bg-white rounded-2xl p-4 sm:p-6 shadow-lg text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">Selamat!</h1>
          
          <div className="relative w-full h-48 sm:h-64 mb-4">
            <Image
              src="/GIF/ezgif.com-animated-gif-maker-14.gif"
              alt="Celebration Animation"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          
          <p className="text-gray-800 text-base sm:text-lg mb-4 font-medium">
            Kamu sudah menyelesaikan semua misi kamu hari ini! Tapi sebelum kamu pergi, bolehkah kami tau kenapa kamu tertarik belajar Digital Marketing?
          </p>
          
          <div className="mb-2">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={maxLength}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 transition-shadow"
              rows={4}
              placeholder="Tulis jawabanmu di sini (maks. 150 karakter)"
            />
            <div className="text-right text-sm text-gray-500 mt-1 pr-1">
              {feedback.length}/{maxLength}
            </div>
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
            disabled={!feedback.trim()}
            className={`flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md ${feedback.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}>
            Selanjutnya
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default M3Q3Scene;
