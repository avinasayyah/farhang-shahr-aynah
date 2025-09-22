import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgeVerificationProps {
  onVerified: (isOver20: boolean) => void;
}

const AgeVerification = ({ onVerified }: AgeVerificationProps) => {
  const [showGoodbye, setShowGoodbye] = useState(false);

  const handleAgeSelection = (isOver20: boolean) => {
    if (isOver20) {
      onVerified(true);
    } else {
      setShowGoodbye(true);
    }
  };

  if (showGoodbye) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <Card className="bg-card-gradient border-2 border-fantasy-pink shadow-fantasy backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-lalezar text-fantasy-black mb-4">
              متاسفیم...
            </h2>
            <p className="text-lg text-fantasy-black/80">
              دسترسی فقط برای بالای ۲۰ سال مجاز است.
            </p>
            <p className="text-xl font-bold text-fantasy-pink mt-4">
              خداحافظ! 💕
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center"
    >
      <Card className="bg-card-gradient border-2 border-fantasy-gold shadow-fantasy backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-6xl mb-6">🎂</div>
          <h2 className="text-3xl font-lalezar text-fantasy-black mb-6">
            سن شما بالای ۲۰ سال است؟
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleAgeSelection(true)}
              className="bg-button-gradient hover:scale-105 transform transition-all duration-200 shadow-glow text-white font-bold text-lg px-8 py-6 rounded-full border-2 border-fantasy-gold"
            >
              ✨ بله، بالای ۲۰ سالم
            </Button>
            <Button
              onClick={() => handleAgeSelection(false)}
              variant="outline"
              className="border-2 border-fantasy-pink text-fantasy-pink hover:bg-fantasy-pink hover:text-white font-bold text-lg px-8 py-6 rounded-full transition-all duration-200"
            >
              خیر، زیر ۲۰ سالم
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AgeVerification;