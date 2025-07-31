import React, { useEffect, useState } from 'react';
import Image from 'next/image';


interface M2ToM3TransitionPopupProps {
  userName: string;
  onNext: () => void;
}

const M2ToM3TransitionPopup: React.FC<M2ToM3TransitionPopupProps> = ({ userName, onNext }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay for the animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 bg-[#FFDE3D] flex justify-center items-center z-[1000] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-6 sm:p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl transition-all duration-300 m-4 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="mx-auto mb-4 w-40 h-40 sm:w-48 sm:h-48">
          <Image
            src="/GIF/ezgif.com-animated-gif-maker-8.gif"
            alt="Thank You"
            width={200}
            height={200}
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed font-medium">
          Wah, diskusi kita hari ini sangat mencerahkan! Sejauh ini saya sangat terbantu, terimakasih {userName}! Tapi kita masih punya 1 meeting lagi, sampai jumpa!
        </div>
        
        <button 
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-lg w-full max-w-xs mx-auto block"
          onClick={onNext}
        >
          Lanjut ke Meeting 3!
        </button>
      </div>
    </div>
  );
};

export default M2ToM3TransitionPopup;
