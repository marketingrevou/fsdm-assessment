import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Confetti from 'react-confetti';
import Cookies from 'js-cookie';
import { getScoresForCurrentUser } from '@/app/actions/scoreActions';
import { getMarketerTypeAndImage } from '@/utils/marketerTypeCalculator';

interface ClosingSceneProps {
  userName: string;
}

const ClosingScene: React.FC<ClosingSceneProps> = ({ userName }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [marketerType, setMarketerType] = useState({ type: 'Curious Marketer', imagePath: '/marketer-type/curious.svg' });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const fetchAndSetMarketerType = async () => {
      const scores = await getScoresForCurrentUser();
      console.log('🔍 Debug - Retrieved scores:', scores);
      if (scores) {
        const { meetingTwoScore, meetingThreeScore } = scores;
        console.log('🔍 Debug - Meeting 2 score:', meetingTwoScore);
        console.log('🔍 Debug - Meeting 3 score:', meetingThreeScore);
        const typeAndImage = getMarketerTypeAndImage(meetingTwoScore, meetingThreeScore);
        console.log('🔍 Debug - Calculated marketer type:', typeAndImage);
        setMarketerType(typeAndImage);
        
        // Clean up cookies after successfully fetching and calculating marketer type
        Cookies.remove('userName');
        Cookies.remove('userEmail');
      } else {
        console.log('🔍 Debug - No scores found, using default');
        // Still clean up cookies even if no scores found
        Cookies.remove('userName');
        Cookies.remove('userEmail');
      }
    };

    fetchAndSetMarketerType();

    // Timer for the image/text fade-in animation (starts after 1s)
    const animationTimer = setTimeout(() => {
      setIsAnimated(true);
    }, 1000);

    // Timer to start confetti after the first animation completes (1s delay + 1s duration)
    const confettiTimer = setTimeout(() => {
      setRunConfetti(true);
    }, 1000);

    // Stop confetti after 5 seconds of running
    const stopConfettiTimer = setTimeout(() => {
      setRunConfetti(false);
    }, 10000); // 1s start + 8s duration

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(confettiTimer);
      clearTimeout(stopConfettiTimer);
    };
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between p-4 bg-white relative overflow-hidden">
      {runConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      {/* Yellow background shape */}
      <div className="absolute inset-0 bg-[#FFDE3D] -z-10" style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
      }} />
      
      {/* Main Content */}
      <div className="w-full max-w-md mx-auto text-center flex flex-col items-center justify-center flex-grow relative z-10 py-2">
        {/* Logo */}
        <div className="w-14 h-14 relative mb-1">
          <Image 
            src="/logorevou.png" 
            alt="RevoU Logo" 
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
        
        {/* Thank you message */}
        <h1 className="text-xl sm:text-2xl font-bold text-black mb-1">
          Selamat {userName}!
        </h1>
        
        <p className="text-black text-sm sm:text-base mt-2">
        🎉Kamu punya potensi di Digital Marketing. 📞Admission Counselor kami akan membantumu membedah hasilnya secara 1-on-1.
        </p>
      </div>
      
      {/* Bottom CTA */}
      <div className="w-full max-w-md mx-auto p-4 relative z-10">
        <p className="text-black text-center mb-3 font-medium">
          Mau tau hasilnya sekarang?
        </p>
        <Link 
          href="https://wa.me/6281399100086" 
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-center"
        >
          Hubungi Admission Counselor Segera
        </Link>
      </div>
    </div>
  );
};

export default ClosingScene;
