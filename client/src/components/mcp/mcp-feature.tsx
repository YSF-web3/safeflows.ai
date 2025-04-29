"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import LoadingSpinner from '../LoadingSpinner';
import { IconBrain, IconShieldLock, IconDatabase, IconChartBar, IconArrowUpRight } from '@tabler/icons-react';
import { initializeMCPConversation } from '@/services/mcp';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const MCPFeature = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const router = useRouter();

  const features = [
    {
      title: 'Solend Integration',
      description: 'Direct connection to Solend\'s lending protocol metrics for real-time risk assessment',
      icon: IconChartBar,
      gradient: 'from-[#FF6B6B] to-[#4ECDC4]',
      stats: ['100+ Metrics', '24/7 Monitoring', 'Real-time Updates']
    },
    {
      title: 'Risk-Aware Context',
      description: 'Maintains awareness of user positions, market conditions, and risk thresholds',
      icon: IconShieldLock,
      gradient: 'from-[#A8E6CF] to-[#3D84A8]',
      stats: ['Smart Alerts', 'Position Tracking', 'Market Analysis']
    },
    {
      title: 'Multi-Model Analysis',
      description: 'Combines insights from GPT and Deepseek models for comprehensive risk assessment',
      icon: IconBrain,
      gradient: 'from-[#FFD93D] to-[#FF6B6B]',
      stats: ['Dual AI Models', 'Cross Validation', 'Enhanced Accuracy']
    },
    {
      title: 'Persistent Memory',
      description: 'Remembers user preferences and past risk assessments for improved recommendations',
      icon: IconDatabase,
      gradient: 'from-[#6C5CE7] to-[#A8E6CF]',
      stats: ['Historical Data', 'Learning System', 'Custom Profiles']
    }
  ];

  const handleTryMCP = async () => {
    try {
      setIsLoading(true);
      const response = await initializeMCPConversation();
      
      toast.success('MCP conversation initialized successfully!');
      
      // Store the conversation ID in localStorage for persistence
      localStorage.setItem('mcpConversationId', response.conversationId);
      
      // Redirect to the MCP chat interface
      router.push(`/mcp/chat/${response.conversationId}`);
    } catch (error) {
      console.error('Failed to initialize MCP:', error);
      toast.error('Failed to initialize MCP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center items-center mb-8 gap-6 flex-col">
          <Image
            src="/logo.svg"
            alt="SafeFlow Logo"
            width={200}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <div className="flex items-center text-2xl font-semibold">
            <Image
              src="/solend-logo.png"
              alt="Solend Logo"
              width={120}
              height={60}
              className="w-auto"
              priority
            />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-6 text-primary">
          Model Context Protocol (MCP)
        </h1>
        <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
          Our advanced AI conversation management system that powers SafeFlows.ai's risk analysis capabilities,
          maintaining contextual awareness across multiple interactions.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
            >
              <div className={`card bg-base-200 shadow-xl overflow-hidden backdrop-blur-lg border border-white/10 hover:border-primary/30 transition-all duration-500`}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Animated Circles */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    initial={{ scale: 0, x: '-50%', y: '-50%' }}
                    animate={{ 
                      scale: hoveredCard === index ? 1 : 0,
                      opacity: hoveredCard === index ? 0.1 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r ${feature.gradient} blur-3xl -z-1 left-0 top-0`}
                  />
                </div>

                <div className="card-body relative z-10">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Icon size={32} stroke={1.5} />
                    </div>
                    <motion.div
                      animate={{
                        rotate: hoveredCard === index ? 0 : -45,
                        opacity: hoveredCard === index ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconArrowUpRight size={24} className="text-primary" />
                    </motion.div>
                  </div>

                  <h3 className="card-title text-primary mt-4">{feature.title}</h3>
                  <p className="text-base-content/70 mb-4">{feature.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    {feature.stats.map((stat, i) => (
                      <motion.div
                        key={stat}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: hoveredCard === index ? 1 : 0,
                          y: hoveredCard === index ? 0 : 10
                        }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="text-xs font-medium text-primary/80 bg-primary/5 rounded-lg py-1 px-2 text-center"
                      >
                        {stat}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Technical Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card bg-base-200 shadow-xl max-w-4xl mx-auto backdrop-blur-lg border border-white/10"
      >
        <div className="card-body">
          <h2 className="card-title text-primary mb-6">Technical Implementation</h2>
          <div className="mockup-code bg-base-300">
            <pre data-prefix="$" className="text-success">
              <code>POST /api/mcp/conversation</code>
            </pre>
            <pre data-prefix=">" className="text-warning">
              <code>{`{
  "modelId": "gpt-4",
  "modelType": "gpt",
  "systemPrompt": "You are a DeFi risk analyst monitoring Solend positions",
  "parameters": {
    "riskThreshold": 0.75,
    "monitoredAssets": ["SOL", "ETH", "USDC"],
    "alertLevel": "conservative"
  }
}`}</code>
            </pre>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-16"
      >
        <button 
          onClick={handleTryMCP}
          disabled={isLoading}
          className="btn btn-primary btn-lg gap-2 min-w-[200px]"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span>Initializing MCP...</span>
            </>
          ) : (
            <>
              <IconBrain className="w-6 h-6" />
              <span>Try MCP Now</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default MCPFeature; 