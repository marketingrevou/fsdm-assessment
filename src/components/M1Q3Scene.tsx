"use client";
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import styles from './M1Q3Scene.module.css';
import QuizResultPopup from './QuizResultPopup';

// Define types for our state
interface Option {
  id: string;
  text: string;
  dropped: boolean;
}

interface DropSlot {
  id: string;
  content: Option | null;
}

interface M1Q3SceneProps {
  onBack: () => void;
  onNext: () => void;
}

const M1Q3Scene: React.FC<M1Q3SceneProps> = ({ onBack, onNext }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState<'none' | 'correct' | 'wrong'>('none');

  const [options, setOptions] = useState<Option[]>([
    { id: 'foto', text: 'Foto Produk', dropped: false },
    { id: 'video', text: 'Video Promosi', dropped: false },
    { id: 'headline', text: 'Judul Iklan (Headline)', dropped: false },
    { id: 'description', text: 'Teks Iklan (Description)', dropped: false },
    { id: 'audio', text: 'Rekaman Audio', dropped: false },
  ]);

  const [dropSlots, setDropSlots] = useState<DropSlot[]>([
    { id: 'slot1', content: null },
    { id: 'slot2', content: null },
  ]);

  const [isCorrect, setIsCorrect] = useState(false);

  const correctCombination = ['headline', 'description'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, optionId: string) => {
    if (options.find(opt => opt.id === optionId)?.dropped) {
        e.preventDefault();
        return;
    }
    e.dataTransfer.setData('optionId', optionId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
    e.preventDefault();
    const optionId = e.dataTransfer.getData('optionId');
    const draggedOption = options.find(opt => opt.id === optionId);

    if (draggedOption && !draggedOption.dropped) {
      const newDropSlots = [...dropSlots];
      const targetSlotIndex = newDropSlots.findIndex(slot => slot.id === slotId);

      if (targetSlotIndex !== -1 && newDropSlots[targetSlotIndex].content === null) {
        newDropSlots[targetSlotIndex].content = draggedOption;
        setDropSlots(newDropSlots);

        setOptions(prevOptions =>
          prevOptions.map(opt =>
            opt.id === optionId ? { ...opt, dropped: true } : opt
          )
        );
      }
    }
  };

  useEffect(() => {
    if (dropSlots[0].content && dropSlots[1].content) {
      const droppedIds = [dropSlots[0].content.id, dropSlots[1].content.id].sort();
      const correctIds = [...correctCombination].sort();

      if (JSON.stringify(droppedIds) === JSON.stringify(correctIds)) {
        setIsCorrect(true);
        setShowPopup('correct');
      } else {
        setShowPopup('wrong');
        setTimeout(() => {
            setShowPopup('none');
            resetQuiz();
        }, 2000);
      }
    }
  }, [dropSlots]);

  const resetQuiz = () => {
    setOptions(options.map(opt => ({ ...opt, dropped: false })));
    setDropSlots(dropSlots.map(slot => ({ ...slot, content: null })));
    setIsCorrect(false);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      <div className={`${styles.notificationBar} ${isVisible ? styles.slideIn : ''} w-full bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-20`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-full flex-shrink-0">
              <span className="text-xl sm:text-2xl">🤔</span>
            </div>
            <p className="text-base font-medium flex-1 text-left">
              Hint: Drag & Drop pilihanmu. Temukan kombinasi paling tepat. 
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-md mx-auto flex flex-col pt-20 px-4 pb-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex-grow flex flex-col">
          <p className="text-center text-gray-800 font-semibold mb-4">
            Oh Google ya! Saya pernah dengar sih iklan di Google Search, bentuk iklan-nya yang pasti tampil apa ya? Pilih 2 dari opsi berikut:
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {options.map((option) => (
              <div
                key={option.id}
                draggable={!option.dropped}
                onDragStart={(e) => handleDragStart(e, option.id)}
                className={`py-2 px-4 rounded-lg font-semibold transition-all duration-200 ease-in-out shadow-md ${ 
                  option.dropped 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                  : 'bg-pink-500 text-white cursor-grab hover:bg-pink-600 active:scale-95 active:cursor-grabbing'
                }`}>
                {option.text}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center w-full space-x-4 my-auto">
            {dropSlots.map((slot, index) => (
              <React.Fragment key={slot.id}>
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot.id)}
                  className="bg-gray-100 border-2 border-dashed border-gray-400 text-gray-500 text-sm sm:text-lg font-medium py-6 rounded-xl w-1/2 h-24 flex items-center justify-center text-center transition-colors duration-200 hover:border-blue-500">
                  {slot.content ? (
                    <span className="text-gray-800 font-bold p-2">{slot.content.text}</span>
                  ) : (
                    'Drop di sini'
                  )}
                </div>
                {index === 0 && <span className="text-gray-800 text-2xl font-semibold">+</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full max-w-md mx-auto p-4 z-10 bg-[#FFDE3D] flex-shrink-0">
        <div className="flex flex-row gap-4 w-full">
          <button 
            onClick={onBack}
            className="h-12 w-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center flex-none shadow-md">
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={onNext}
            disabled={!isCorrect}
            className={`flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}>
            Selanjutnya
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <QuizResultPopup isVisible={showPopup !== 'none'} onClose={() => setShowPopup('none')}>
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
          {showPopup === 'correct' ? (
            <>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image src="/GIF/ezgif.com-animated-gif-maker-8.gif" alt="Correct" layout="fill" objectFit="contain" unoptimized />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kerja Bagus!</h3>
              <p className="text-gray-600 mb-6">
                Betul! <strong>Headline</strong> dan <strong>Description</strong> adalah pondasi utama dari setiap iklan di Google Search.
              </p>
              <button
                onClick={onNext}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105 shadow-lg">
                Luar biasa! <FaArrowRight />
              </button>
            </>
          ) : (
            <>
              <p className="text-red-500 text-lg font-bold mb-4">
                Oops, belum tepat!
              </p>
              <p className="text-gray-600">
                  Coba lagi ya, perhatikan format media apa yang pasti tampil waktu seseorang mencari di Google Search.
              </p>
            </>
          )}
        </div>
      </QuizResultPopup>
    </div>
  );
};

export default M1Q3Scene;
