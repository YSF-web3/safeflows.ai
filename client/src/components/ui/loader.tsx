"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ 
    isLoading = true,
    loadingMessages = [
        "Getting Data...",
        "Calculating predictions...",
        "Analyzing market trends...",
        "Generating insights...",
        "Processing information..."
    ], 
    imageSrc = "/coin.png",
    imageAlt = "SafeFlows Loading"
}) => {
    const [loadingText, setLoadingText] = useState(loadingMessages[0] || '');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (loadingMessages.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % loadingMessages.length;
                setLoadingText(loadingMessages[newIndex]);
                return newIndex;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [loadingMessages]);

    return (
        <motion.div 
            className="flex flex-col justify-center items-center w-full h-full bg-black/70 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="glass-container p-8 rounded-2xl flex flex-col items-center justify-center">
                <motion.div
                    className="relative mb-4"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                >
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                    <img
                        className="relative w-[160px] h-[160px] object-contain"
                        src={imageSrc}
                        width="160"
                        height="160"
                        alt={imageAlt}
                    />
                </motion.div>
                
                <div className="flex flex-col items-center">
                    <div className="mb-4 flex flex-col items-center gap-2">
                        <div className="relative h-[6px] w-[180px] bg-background-light/40 overflow-hidden rounded-full">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-primary/80 rounded-full"
                                animate={{
                                    x: ["-100%", "100%"],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        </div>
                        
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentIndex}
                                className="text-sm text-text-secondary text-center min-h-[20px]"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3 }}
                            >
                                {loadingText}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
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