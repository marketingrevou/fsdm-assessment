"use client";
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './M2Q2Scene.module.css';
import ProgressBar from './ProgressBar';

import { correctAnswers } from '@/lib/answers';

interface M2Q2SceneProps {
  userName: string;
  onBack: () => void;
  onNext: (score: number) => void;
}

const M2Q2Scene: React.FC<M2Q2SceneProps> = ({ onBack, onNext }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('');
  const [operator, setOperator] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState('');
  const popupText = "Hebat! Sama dengan sebelumnya, silakan gunakan kalkulator dibawah untuk menjawab.";

  useEffect(() => {
    const sceneTimer = setTimeout(() => setIsVisible(true), 100);
    const popupTimer = setTimeout(() => setShowPopup(false), 8000);
    return () => {
      clearTimeout(sceneTimer);
      clearTimeout(popupTimer);
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
  const buttonSizeClasses = 'text-xl sm:text-lg lg:text-2xl';

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFDE3D] relative overflow-hidden">
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-yellow-100 px-6 py-4 flex items-center gap-3">
              <div className="bg-yellow-300 p-2 rounded-full">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Instruksi Penting</h3>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-gray-800 leading-relaxed mb-6">
                {popupText}
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-8 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                >
                  Oke, Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full overflow-y-auto pb-16 lg:pb-20 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:gap-4 p-4 lg:px-8 transition-all duration-500 ease-in-out lg:items-center">
          
          {/* Question Section */}
          <div className="w-full lg:w-3/5 mb-6 lg:mb-0 flex items-center">
            <div className="bg-white/50 rounded-xl p-4 lg:p-6 shadow w-full flex items-center justify-center min-h-[200px] lg:min-h-[300px]">
              <p className="text-base lg:text-lg xl:text-xl text-black text-center w-full leading-relaxed">
                Oke… Nah ternyata tiap pelanggan itu menghabiskan rata-rata 50 ribu di kafe kami. Kalau dengan budget iklan 750.000 dan 25 pelanggan yang hadir, berapa perkiraan keuntungan yang saya peroleh?
              </p>
            </div>
          </div>
          
          {/* Calculator Section */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-6">
              <div className="text-right text-gray-500 text-xs lg:text-sm mb-1 pr-2 h-4 lg:h-4 truncate">{calculationHistory || ' '}</div>
              <div className="text-right text-black font-light mb-4 lg:mb-6 pr-2 text-6xl sm:text-3xl lg:text-5xl xl:text-7xl overflow-x-auto whitespace-nowrap">{display}</div>
              <div className="grid grid-cols-4 gap-2 lg:gap-3">
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
      </div>

      {/* Bottom Navigation */}
      <div className="w-full max-w-md lg:max-w-7xl mx-auto p-3 lg:p-4 z-10 bg-[#FFDE3D] fixed bottom-0 left-0 right-0">
        <div className="flex flex-col items-center w-full">
          <button 
            onClick={() => {
              // Normalize the display value by removing trailing zeros and decimal points
              const normalizedDisplay = parseFloat(display).toString();
              const score = (normalizedDisplay === correctAnswers.M2Q2) ? 1 : 0;
              onNext(score);
            }}
            className='w-full lg:max-w-md h-10 lg:h-12 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 shadow-md'>
            Kirim Jawaban
            <FaArrowRight className="w-4 h-4" />
          </button>
          <div className="w-full lg:max-w-md mt-2">
            <ProgressBar current={2} total={7} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default M2Q2Scene;
