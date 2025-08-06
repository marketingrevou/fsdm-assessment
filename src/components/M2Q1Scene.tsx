"use client";
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './M2Q1Scene.module.css';

import { correctAnswers } from '@/lib/answers';

interface M2Q1SceneProps {
  userName: string;
  onBack: () => void;
  onNext: (score: number) => void;
}

const M2Q1Scene: React.FC<M2Q1SceneProps> = ({ userName, onBack, onNext }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isNotificationVisible, setNotificationVisible] = useState(true);
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('');
  const [operator, setOperator] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState('');
  const fullText = "Saatnya kita hitung-hitungan nih. Gunakan kalkulator dibawah untuk menjawab, jangan lupa dikirim ya. ⚠️ Pastikan jawab dengan benar, karena tidak ada pilihan kembali ya ";

  useEffect(() => {
    const sceneTimer = setTimeout(() => setIsVisible(true), 100);
    const notificationTimer = setTimeout(() => setNotificationVisible(false), 8000);

    return () => {
      clearTimeout(sceneTimer);
      clearTimeout(notificationTimer);
    };
  }, []);

  const handleNumberClick = (num: number | string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setCurrentValue(String(num));
      setWaitingForOperand(false);
    } else {
      if (num === '.' && currentValue.includes('.')) {
        return;
      }
      const newValue = currentValue === '0' && num !== '.' ? String(num) : currentValue + String(num);
      setDisplay(newValue);
      setCurrentValue(newValue);
    }
  };

  const performCalculation: { [key: string]: (prev: number, next: number) => number } = {
    '/': (prev, next) => prev / next,
    '*': (prev, next) => prev * next,
    '-': (prev, next) => prev - next,
    '+': (prev, next) => prev + next,
  };

  const handleOperatorClick = (nextOperator: string) => {
    const inputValue = parseFloat(currentValue);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator && !waitingForOperand) {
      const result = performCalculation[operator](previousValue, inputValue);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setCalculationHistory(`${previousValue === null ? inputValue : display} ${nextOperator}`);
    setWaitingForOperand(true);
    setOperator(nextOperator);
    setCurrentValue('');
  };

  const handleEqualsClick = () => {
    if (operator === null || currentValue === '') {
      return;
    }
    const inputValue = parseFloat(currentValue);
    if (previousValue !== null) {
        const result = performCalculation[operator](previousValue, inputValue);
        setDisplay(String(result));
        setCurrentValue(String(result));
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        setCalculationHistory('');
    }
  };

  const handleClearClick = () => {
    setDisplay('0');
    setCurrentValue('');
    setOperator(null);
    setPreviousValue(null);
    setWaitingForOperand(false);
    setCalculationHistory('');
  };

  const handleToggleSignClick = () => {
    if (currentValue !== '' && currentValue !== '0') {
      const toggledValue = parseFloat(currentValue) * -1;
      setDisplay(String(toggledValue));
      setCurrentValue(String(toggledValue));
    } else if (display !== '0') {
      const toggledValue = parseFloat(display) * -1;
      setDisplay(String(toggledValue));
      setCurrentValue(String(toggledValue)); 
    }
  };

  const handlePercentageClick = () => {
    const value = parseFloat(currentValue || display);
    const result = value / 100;
    setDisplay(String(result));
    setCurrentValue(String(result));
  };

  const handleBackspaceClick = () => {
    if (display.length === 1 || display === '0') {
      setDisplay('0');
      setCurrentValue('');
    } else {
      setDisplay(display.slice(0, -1));
      setCurrentValue(currentValue.slice(0, -1));
    }
  };

  const buttonBaseClasses = 'rounded-full font-semibold flex items-center justify-center shadow-sm transition-transform duration-100 active:scale-95 aspect-square';
  const buttonSizeClasses = 'text-2xl sm:text-3xl';

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Animated notification bar */}
      <div
        className={`w-full bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-20 transition-transform duration-500 ease-in-out ${
          isNotificationVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className={`bg-white p-2 rounded-full flex-shrink-0 ${styles.emojiPop}`}>
              <span className="text-xl sm:text-2xl">🖐️</span>
            </div>
            <p className="text-base font-medium flex-1 text-left">
              {fullText}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full overflow-y-auto pb-24">
        <div className={`w-full max-w-md mx-auto flex flex-col p-4 transition-all duration-500 ease-in-out ${
          isNotificationVisible ? 'pt-40' : 'pt-8'
        }`}>
        <div className="w-full max-w-md text-center">
          <p className="text-lg sm:text-xl text-black mb-6 bg-white/50 rounded-xl p-4 shadow">
            Jadi gini, kami sudah keluarkan Rp300.000 untuk iklan Facebook itu. Dari situ, kami senang sekali karena berhasil mendapatkan 10 pelanggan baru yang pertama kali datang dan belanja di toko kami. Nah, menurut <strong>{userName}</strong>, kalau saya mau raih 25 pelanggan baru, saya perlu siapkan uang berapa ya?
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
          <div className="text-right text-gray-500 text-lg sm:text-xl mb-2 pr-2 h-7 sm:h-8 truncate">{calculationHistory || ' '}</div>
          <div className="text-right text-black font-light mb-4 sm:mb-6 pr-2 text-5xl sm:text-6xl overflow-x-auto whitespace-nowrap">{display}</div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-gray-300 text-black`} onClick={handleClearClick}>C</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-gray-300 text-black`} onClick={handleToggleSignClick}>+/-</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-gray-300 text-black`} onClick={handlePercentageClick}>%</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-blue-500 text-white`} onClick={() => handleOperatorClick('/')}>÷</button>

            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(7)}>7</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(8)}>8</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(9)}>9</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-blue-500 text-white`} onClick={() => handleOperatorClick('*')}>×</button>

            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(4)}>4</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(5)}>5</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(6)}>6</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-blue-500 text-white`} onClick={() => handleOperatorClick('-')}>-</button>

            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(1)}>1</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(2)}>2</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(3)}>3</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-blue-500 text-white`} onClick={() => handleOperatorClick('+')}>+</button>

            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick('.')}>.</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-yellow-400 text-black`} onClick={() => handleNumberClick(0)}>0</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-gray-300 text-black`} onClick={handleBackspaceClick}>⌫</button>
            <button className={`${buttonBaseClasses} ${buttonSizeClasses} bg-blue-500 text-white`} onClick={handleEqualsClick}>=</button>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full max-w-md mx-auto p-4 z-10 bg-[#FFDE3D] fixed bottom-0 left-0 right-0">
        <div className="flex flex-row justify-center w-full">
          <button 
            onClick={() => {
              // Normalize the display value by removing trailing zeros and decimal points
              const normalizedDisplay = parseFloat(display).toString();
              const score = (normalizedDisplay === correctAnswers.M2Q1) ? 1 : 0;
              onNext(score);
            }}
            className='flex-1 h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 shadow-md'>
            Kirim Jawaban
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default M2Q1Scene;
