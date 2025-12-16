"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import styles from './M1Q3Scene.module.css';
import QuizResultPopup from './QuizResultPopup';
import ProgressBar from './ProgressBar';

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
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [activeDragItem, setActiveDragItem] = useState<string | null>(null);
  const [touchTarget, setTouchTarget] = useState<HTMLElement | null>(null);

  const correctCombination = ['headline', 'description'];
  
  const resetQuiz = useCallback(() => {
    setOptions(prevOptions => prevOptions.map(opt => ({ ...opt, dropped: false })));
    setDropSlots([
      { id: 'slot1', content: null },
      { id: 'slot2', content: null },
    ]);
    setIsCorrect(false);
    setShowPopup('none');
  }, []);

  // Handle touch start for mobile
  const handleTouchStart = (e: React.TouchEvent, optionId: string) => {
    if (options.find(opt => opt.id === optionId)?.dropped) {
      e.preventDefault();
      return;
    }
    
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setActiveDragItem(optionId);
    
    // Create a visual feedback element
    const touchFeedback = document.createElement('div');
    touchFeedback.id = 'touch-feedback';
    touchFeedback.style.position = 'fixed';
    touchFeedback.style.pointerEvents = 'none';
    touchFeedback.style.zIndex = '1000';
    touchFeedback.style.transform = 'translate(-50%, -50%)';
    touchFeedback.style.transition = 'transform 0.1s';
    
    const option = document.querySelector(`[data-option-id="${optionId}"]`);
    if (option) {
      touchFeedback.innerHTML = option.textContent || '';
      touchFeedback.style.padding = '8px 16px';
      touchFeedback.style.borderRadius = '0.5rem';
      touchFeedback.style.background = '#EC4899';
      touchFeedback.style.color = 'white';
      touchFeedback.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      document.body.appendChild(touchFeedback);
      setTouchTarget(touchFeedback);
    }
  };

  // Handle touch move for mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchTarget) return;
    
    const touch = e.touches[0];
    touchTarget.style.left = `${touch.clientX}px`;
    touchTarget.style.top = `${touch.clientY}px`;
    
    // Prevent scrolling while dragging
    if (Math.abs(touch.clientX - touchStartX) > 5 || Math.abs(touch.clientY - touchStartY) > 5) {
      e.preventDefault();
    }
  };

  // Handle touch end for mobile
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchTarget || !activeDragItem) {
      cleanupTouchFeedback();
      return;
    }

    const touch = e.changedTouches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const dropZone = elements.find(el => el.hasAttribute('data-drop-slot'));
    
    if (dropZone && activeDragItem) {
      const slotId = dropZone.getAttribute('data-drop-slot');
      if (slotId) {
        const mockEvent = {
          preventDefault: () => {},
          dataTransfer: {
            getData: () => activeDragItem
          }
        } as unknown as React.DragEvent<HTMLDivElement>;
        handleDrop(mockEvent, slotId);
      }
    }
    
    cleanupTouchFeedback();
  };

  // Clean up touch feedback
  const cleanupTouchFeedback = useCallback(() => {
    if (touchTarget && document.body.contains(touchTarget)) {
      document.body.removeChild(touchTarget);
    }
    setActiveDragItem(null);
    setTouchTarget(null);
  }, [touchTarget]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupTouchFeedback();
    };
  }, [cleanupTouchFeedback]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);



  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, optionId: string) => {
    if (options.find(opt => opt.id === optionId)?.dropped) {
        e.preventDefault();
        return;
    }
    e.dataTransfer.setData('optionId', optionId);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
    e.preventDefault();
    setIsDragging(false);
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
  }, [dropSlots, correctCombination, resetQuiz]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FFDE3D] relative">
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
                  <div className="flex-grow w-full p-4 md:px-32 pt-24 flex items-start md:items-center justify-center">
                  <div className="w-full bg-white rounded-2xl p-6 flex flex-col gap-6 justify-between">
          <p className="text-center text-gray-700 text-base sm:text-lg">
            Oh Google ya! Saya pernah dengar sih iklan di Google Search, bentuk iklan-nya yang pasti tampil apa ya? Pilih 2 dari opsi berikut:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {options.map((option) => (
              <div
                key={option.id}
                draggable={!option.dropped}
                onDragStart={(e) => handleDragStart(e, option.id)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, option.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={cleanupTouchFeedback}
                data-option-id={option.id}
                className={`py-2 px-4 rounded-lg font-semibold transition-all duration-200 ease-in-out shadow-md touch-none select-none ${
                  option.dropped 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                  : 'bg-pink-500 text-white cursor-grab hover:bg-pink-600 active:scale-95 active:cursor-grabbing'
                }`}>
                {option.text}
              </div>
            ))}
          </div>

                    <div className="flex items-center justify-center w-full space-x-4">
            {dropSlots.map((slot, index) => (
              <React.Fragment key={slot.id}>
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot.id)}
                  onTouchMove={handleTouchMove}
                  data-drop-slot={slot.id}
                  className={`${styles.dropSlot} ${isDragging || activeDragItem ? styles.dropSlotDragging : ''} touch-none select-none`}>

                  {slot.content ? (
                    <span className="text-gray-800 font-bold p-2">{slot.content.text}</span>
                  ) : (
                    '⬇️Tarik pilihanmu ke sini'
                  )}
                </div>
                {index === 0 && <span className="text-gray-800 text-2xl font-semibold">+</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 w-full max-w-md mx-auto p-4 z-10 bg-[#FFDE3D] flex-shrink-0">
                <div className="flex flex-col items-center w-full">
          <div className="flex flex-row gap-4 w-full">
          <button 
            onClick={onBack}
            className="h-12 w-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center flex-none">
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={onNext}
            disabled={!isCorrect}
            className={`flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}>
            Selanjutnya
            <FaArrowRight className="w-4 h-4" />
          </button>
          </div>
          <div className="w-full lg:max-w-md mt-2">
            <ProgressBar current={3} total={3} />
          </div>
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
