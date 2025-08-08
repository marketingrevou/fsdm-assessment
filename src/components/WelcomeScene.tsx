import React from 'react';
import Image from 'next/image';

interface WelcomeSceneProps {
  onNext: () => void;
}

const WelcomeScene: React.FC<WelcomeSceneProps> = ({ onNext }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 bg-white relative overflow-hidden">
      {/* Yellow background shape */}
      <div 
        className="absolute inset-0 bg-[#FFDE3D] -z-10"
        style={{
          clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
          height: '100%',
          width: '100%',
        }}
      />
      
      <div className="w-full max-w-md mx-auto text-center flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-2 sm:mb-4 w-16 h-16 sm:w-20 sm:h-20 relative">
          <Image 
            src="/logorevou.png" 
            alt="RevoU Logo" 
            fill
            sizes="(max-width: 640px) 64px, 80px"
            className="object-contain"
            priority
          />
        </div>
        
        {/* Headline */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4 px-2">
          Selamat Datang, Calon Digital Marketer!
        </h1>
        
        {/* Animated GIF */}
        <div className="w-full max-w-[200px] sm:max-w-[240px] mx-auto my-2 sm:my-4 aspect-square relative">
          <Image
            src="/GIF/ezgif.com-animated-gif-maker.gif"
            alt="Digital Marketing"
            fill
            sizes="(max-width: 640px) 240px, 280px"
            className="object-contain"
            priority
          />
        </div>
        
        {/* Subheadline */}
        <p className="text-sm sm:text-base text-gray-600 mb-2 px-2">
          Cari tahu tipe Digital Marketer seperti apakah kamu?
        </p>
        
        {/* Duration */}
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 px-2">
          🕒10-15 menit
        </p>

        {/* CTA Button */}
        <div className="w-full px-4 pt-4">
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 w-full max-w-xs mx-auto block"
            onClick={onNext}
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScene;
