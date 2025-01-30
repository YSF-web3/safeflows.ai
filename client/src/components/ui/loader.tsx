"use client"

import React, { useState, useEffect } from 'react';
import {BeatLoader} from "react-spinners"
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ 
    isLoading = false,
    loadingMessages = [
        "Getting Data...",
        "Calculating predictions...",
        "Analyzing market trends...",
        "Generating insights...",
        "Processing information..."
    ], 
    imageSrc = "/coin.png",
    imageAlt = ""
}) => {
    const [loadingText, setLoadingText] = useState('');

    useEffect(() => {
        if (loadingMessages.length === 0) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            setLoadingText(loadingMessages[currentIndex]);
            currentIndex = (currentIndex + 1) % loadingMessages.length;
        }, 2000);

        return () => clearInterval(interval);
    }, [isLoading, loadingMessages]);


    return (
        <div className="flex flex-col absolute w-full h-full items-center justify-center bg-opacity-80 bg-black">
            <div className="relative">
                <img
                  className="mx-auto w-[200px]  "
                  src={imageSrc}
                  width="40"
                  height="40"
                  alt={imageAlt}
                />
            </div>
            <div className="mt-[-25px] w-full flex flex-col items-center justify-center">
                <BeatLoader color="#C9F31D"/>
                {loadingMessages.length > 0 && (
                    <div className="mt-2 flex flex-col items-center justify-center gap-4">
                      <p className="text-sm text-gray-400 animate-fade-in">
                          {loadingText ?? loadingMessages[0]}
                      </p>
                    </div>
                )}
            </div>
        
        </div>
    );
};

// Add required animations to your global CSS or tailwind config
const styles = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in-out;
}
`;

export default LoadingScreen;