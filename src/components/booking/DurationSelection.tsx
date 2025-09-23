import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Duration } from '../../types/booking';

interface DurationSelectionProps {
  selected: 1 | 2 | 5 | null;
  onSelect: (duration: 1 | 2 | 5) => void;
  onBack: () => void;
}

const durations: Duration[] = [
  { hours: 1, price: 5000000, label: 'یک ساعت' },
  { hours: 2, price: 8000000, label: 'دو ساعت' },
  { hours: 5, price: 15000000, label: 'پنج ساعت' }
];

const DurationSelection = ({ selected, onSelect, onBack }: DurationSelectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-lalezar text-white mb-4">
          مدت زمان مورد نظرتان را انتخاب کنید
        </h2>
        <p className="text-white/90">
          هر لحظه با شما ارزشمند است ⏰
        </p>
      </div>

      <div className="grid gap-6">
        {durations.map((duration) => (
          <Card 
            key={duration.hours}
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 bg-card-gradient backdrop-blur-sm ${
              selected === duration.hours 
                ? 'border-fantasy-gold shadow-glow' 
                : 'border-fantasy-pink hover:border-fantasy-gold'
            }`}
            onClick={() => onSelect(duration.hours)}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-lalezar text-fantasy-black flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {duration.hours === 1 && '⏱️'}
                  {duration.hours === 2 && '⏰'}
                  {duration.hours === 5 && '🕐'}
                  {duration.label}
                </span>
                <Badge className="bg-fantasy-pink text-white font-bold text-lg font-inter">
                  {duration.price.toLocaleString('en-US')} تومان
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fantasy-black/80">
                {duration.hours === 1 && 'تجربه‌ای کوتاه اما شیرین و فراموش‌نشدنی'}
                {duration.hours === 2 && 'زمان کافی برای تجربه‌ای کامل و لذت‌بخش'}
                {duration.hours === 5 && 'تجربه‌ای جامع و عمیق با امکانات ویژه'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-white bg-white/40 text-white hover:bg-white hover:text-fantasy-black font-bold"
        >
          بازگشت
        </Button>
        
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              onClick={() => onSelect(selected)}
              className="bg-button-gradient hover:scale-105 transform transition-all duration-200 shadow-glow text-white font-bold px-8"
            >
              ادامه ✨
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DurationSelection;