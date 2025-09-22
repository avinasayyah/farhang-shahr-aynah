import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const TelegramButton = () => {
  const telegramId = '@avinasayah';
  
  const openTelegram = () => {
    window.open(`https://t.me/${telegramId.replace('@', '')}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={openTelegram}
        className="bg-button-gradient hover:scale-110 transform transition-all duration-300 shadow-glow rounded-full w-16 h-16 p-0 border-2 border-fantasy-gold"
        title={`ارتباط با ${telegramId}`}
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </Button>
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-fantasy-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        تلگرام: {telegramId}
      </div>
    </div>
  );
};

export default TelegramButton;