import React, { useState } from 'react';

// Main App component
const App = () => {
  // Array of speech bubble texts
  const speechBubbles = [
    "Nah, jadi minggu depan kami mau membuat **Festival Mekar & Kopi Musim Semi** nih.",
    "Tujuannya untuk terus meningkatkan pengunjung ke toko kami terutama anak-anak muda. Disana nanti mereka bisa menikmati kopi di tengah taman bunga.",
    "Akan ada festival musik juga yang dihadiri beberapa musisi lokal favorit. Kami juga akan mengadakan undian berhadiah yang bisa pengunjung menangkan."
  ];

  // State to keep track of the number of currently displayed speech bubbles
  const [visibleBubblesCount, setVisibleBubblesCount] = useState(1); // Start with the first bubble visible

  // Function to show the next speech bubble
  const handleNext = () => {
    if (visibleBubblesCount < speechBubbles.length) {
      setVisibleBubblesCount(visibleBubblesCount + 1);
    }
  };

  // Function to hide the last speech bubble (go back)
  const handleBack = () => {
    if (visibleBubblesCount > 1) { // Always keep at least one bubble visible
      setVisibleBubblesCount(visibleBubblesCount - 1);
    }
  };

  // Helper function to render text with bold formatting
  const renderTextWithBold = (text) => {
    // Split the text by '**' to find bold parts
    const parts = text.split('**');
    return parts.map((part, index) => {
      // Every second part (index 1, 3, 5...) should be bold
      return index % 2 === 1 ? <strong key={index}>{part}</strong> : part;
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top section with yellow background and illustration */}
      <div className="relative flex-grow bg-[#FEE140] flex flex-col items-center justify-start pt-16 pb-40 md:pb-32 lg:pb-24 overflow-hidden">
        {/* Speech bubbles container */}
        <div className="w-full max-w-md px-4 space-y-4 z-10">
          {/* Map through all speech bubbles and display based on visibleBubblesCount */}
          {speechBubbles.map((text, index) => (
            <div
              key={index}
              className={`
                bg-white p-4 rounded-xl shadow-md relative
                transition-opacity duration-500 ease-in-out
                ${index < visibleBubblesCount ? 'opacity-100 block' : 'opacity-0 hidden'}
                ${index === 0 ? 'mt-0' : 'mt-4'}
              `}
            >
              <p className="text-gray-800 text-base leading-relaxed">
                {renderTextWithBold(text)}
              </p>
              {/* Speech bubble tail using an absolutely positioned div */}
              <div
                className="absolute bottom-[-10px] left-8 w-0 h-0"
                style={{
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid white',
                  transform: 'translateX(-50%)' // Center the tail relative to its left position
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Illustration - Using a placeholder for now. Consider replacing with an SVG for better quality. */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg md:max-w-xl lg:max-w-2xl z-0">
          <img
            src="https://placehold.co/600x400/FEE140/000000?text=Your+Illustration+Here"
            alt="Illustration of a person with a laptop"
            className="w-full h-auto object-contain"
            // The image in the original design has a specific shape, this placeholder is rectangular.
            // For a more accurate representation, a custom SVG illustration would be ideal here.
            style={{
              clipPath: 'polygon(0 80%, 100% 80%, 100% 100%, 0% 100%)', // Adjust this if you want to crop the placeholder
              transform: 'translateY(20%)' // Adjust to position the illustration correctly
            }}
          />
        </div>
      </div>

      {/* Bottom section with white background and navigation buttons */}
      <div className="bg-white p-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 shadow-lg">
        <button
          onClick={handleBack}
          disabled={visibleBubblesCount === 1} // Disable if only the first bubble is visible
          className={`
            flex items-center justify-center px-6 py-3 rounded-full text-lg font-semibold
            transition-all duration-300 ease-in-out
            ${visibleBubblesCount === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg'
            }
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>

        <button
          onClick={handleNext}
          disabled={visibleBubblesCount === speechBubbles.length} // Disable if all bubbles are visible
          className={`
            flex items-center justify-center px-6 py-3 rounded-full text-lg font-semibold
            transition-all duration-300 ease-in-out
            ${visibleBubblesCount === speechBubbles.length
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg'
            }
          `}
        >
          Selanjutnya
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default App;
