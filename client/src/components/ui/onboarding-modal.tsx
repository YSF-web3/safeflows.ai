import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana/solana-provider";
import { Shield, Lightbulb, Layout, Bell, ExternalLink } from 'lucide-react';
import { motion } from "framer-motion";

const FeatureItem = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.5, 
      delay: delay,
      ease: [0.4, 0, 0.2, 1] 
    }}
    className="bg-background-light rounded-xl p-4 flex flex-col gap-3 border border-border hover:border-primary/80 hover:shadow-inner-glow transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
  >
    <div className="text-primary flex items-center justify-center h-14">
      <Icon size={32} className="sm:w-10 sm:h-10 w-8 h-8" />
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-white font-bold text-base sm:text-lg">{title}</span>
      <span className="text-text-secondary text-xs sm:text-sm leading-tight">{description}</span>
    </div>
  </motion.div>
);

export const ProtocolCard = ({ logo, name, isLive = true, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.5, 
      delay: delay,
      ease: [0.4, 0, 0.2, 1] 
    }}
    whileHover={{ scale: 1.03 }}
    className="bg-background-light rounded-xl p-6 flex flex-col items-center gap-4 border border-border hover:border-primary/80 transition-all duration-300 relative overflow-hidden group"
  >
    <motion.div 
      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />
    <img src={logo} alt={name} className="h-16 w-16 object-contain relative z-10" />
    <span className="text-white font-bold text-lg relative z-10">{name}</span>
    {!isLive && (
      <div className="absolute top-3 right-3 bg-background-card px-3 py-1 rounded-full">
        <span className="text-xs text-text-secondary">Coming Soon</span>
      </div>
    )}
    {isLive && (
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-primary/30"
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
      />
    )}
  </motion.div>
);

const OnBoardingModal = ({ isOpen, onClose, poolsData }: any) => {
  const { connected, publicKey } = useWallet();

  // Determine if modal should be open based on conditions
  const shouldShowModal = !connected || (connected && poolsData?.length === 0);

  if (!shouldShowModal) return null;
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-50 inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[700px] w-full border rounded-2xl border-white/10 bg-background-card overflow-hidden h-fit"
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          {!connected ? (
            <>
              <div className="flex flex-col gap-6 items-center">
                <motion.div 
                  className="flex flex-col gap-1 items-center"
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <div className="text-xl sm:text-2xl text-white flex flex-col max-w-[300px] items-center gap-2 mb-6">
                    <span className="font-light text-xs sm:text-sm text-text-secondary">Welcome to</span>
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      src="/logo.svg" 
                      className="w-[240px] sm:w-[280px]" 
                      alt="SafeFlows.ai Logo"
                    />
                  </div>
                  <motion.h2 
                    className="text-sm sm:text-lg text-center"
                    variants={fadeInUpVariants}
                    custom={1}
                  >
                    REVOLUTIONIZING
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark ml-1 mr-1">
                      RISK MANAGEMENT
                    </span>
                    <br className="sm:hidden" /> IN DECENTRALIZED FINANCE
                  </motion.h2>
                </motion.div>

                <div className="grid grid-cols-2 gap-3 lg:gap-5 w-full mt-2 mb-6">
                  <FeatureItem 
                    icon={Shield}
                    title="Built on Solana"
                    description="Leverages Solana's high-speed, low-cost infrastructure."
                    delay={0.2}
                  />
                  <FeatureItem 
                    icon={Lightbulb}
                    title="AI-Driven Insights"
                    description="Personalized recommendations powered by DeepSeek AI."
                    delay={0.3}
                  />
                  <FeatureItem 
                    icon={Layout}
                    title="User-Friendly Interface"
                    description="Simplifies complex DeFi strategies into dashboards."
                    delay={0.4}
                  />
                  <FeatureItem 
                    icon={Bell}
                    title="Real-Time Alerts"
                    description="Stay ahead of market changes with notifications."
                    delay={0.5}
                  />
                </div>
                
                <motion.div 
                  className="flex flex-col gap-1 items-center justify-center"
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={6}
                >
                  <span className="text-text-secondary text-xs">Powered By</span>
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src="/deepseek.png"
                    className="mt-[-10px] w-[150px]"
                    alt="DeepSeek AI"
                  />
                </motion.div>
            
                <motion.p 
                  className="text-text-secondary mt-4 text-sm"
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={7}
                >
                  Connect your wallet to access all features
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-col gap-4 justify-end items-center"
                variants={fadeInUpVariants}
                initial="hidden"
                animate="visible"
                custom={8}
              >
                <WalletButton />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="text-text-secondary hover:text-white transition-colors duration-300 text-sm"
                >
                  Connect later
                </motion.button>
              </motion.div>
            </>
          ) : poolsData?.length === 0 ? (
            <>
              <motion.div 
                className="flex flex-col gap-6 items-center"
                variants={fadeInUpVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <div className="text-2xl text-white flex flex-col items-center gap-2 mb-4">
                  <img src="/logo.svg" alt="SafeFlows.ai Logo" className="w-[250px]" />
                  <div className="flex flex-col items-center mt-2">
                    <span className="font-light text-sm text-text-secondary">Connected Wallet</span>
                    <span className="text-xs text-primary font-mono bg-primary/10 px-4 py-2 rounded-full mt-1 max-w-full overflow-hidden text-ellipsis">
                      {publicKey?.toBase58()}
                    </span>
                  </div>
                </div>
                
                <motion.div 
                  className="text-text-secondary text-center text-sm p-4 glass-container rounded-xl border border-white/10 w-full"
                  variants={fadeInUpVariants}
                  custom={1}
                >
                  It looks like you don't have any ongoing lendings at the moment.
                </motion.div>
                
                <motion.h2 
                  className="text-xl uppercase text-white font-bold mt-2 flex items-center gap-2"
                  variants={fadeInUpVariants}
                  custom={2}
                >
                  <span className="h-1 w-6 bg-primary rounded-full"></span>
                  Get Started
                  <span className="h-1 w-6 bg-primary rounded-full"></span>
                </motion.h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <ProtocolCard 
                  logo="/solend-logo.png" 
                  name="Solend" 
                  isLive={true}
                  delay={0.3}
                />
                <ProtocolCard 
                  logo="/port-logo.png" 
                  name="Port Finance" 
                  isLive={false}
                  delay={0.4}
                />
                <ProtocolCard 
                  logo="/hubble-logo.webp" 
                  name="Hubble" 
                  isLive={false}
                  delay={0.5}
                />
              </div>

              <motion.div 
                className="flex flex-col gap-4 items-center"
                variants={fadeInUpVariants}
                initial="hidden"
                animate="visible"
                custom={6}
              >
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "#d4f542" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full max-w-md bg-primary text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-neon"
                  onClick={onClose}
                >
                  Create Pool with Solend
                  <ExternalLink size={18} />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="text-text-secondary hover:text-white transition-colors duration-300 text-sm"
                >
                  I'll do this later
                </motion.button>
              </motion.div>
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnBoardingModal;
