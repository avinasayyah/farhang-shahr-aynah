import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExperienceType } from '../../types/booking';

interface ExperienceSelectionProps {
  selected: 'one-way' | 'two-way' | null;
  onSelect: (type: 'one-way' | 'two-way') => void;
  onBack: () => void;
}

const experiences: ExperienceType[] = [
  {
    id: 'one-way',
    title: '✨ تجربه یک‌طرفه فانتزی',
    description: 'تجربه‌ای رویایی و خاص',
  },
  {
    id: 'two-way',
    title: '💖 تجربه دوطرفه فانتزی',
    description: 'تجربه‌ای کامل و تعاملی',
    price: 2000000
  }
];

const ExperienceSelection = ({ selected, onSelect, onBack }: ExperienceSelectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-lalezar text-white mb-4">
          نوع تجربه مورد نظرتان را انتخاب کنید
        </h2>
        <p className="text-white/90">
          هر کدام تجربه‌ای منحصر به فرد دارند 💫
        </p>
      </div>

      <div className="grid gap-6">
        {experiences.map((exp) => (
          <Card 
            key={exp.id}
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 bg-card-gradient backdrop-blur-sm ${
              selected === exp.id 
                ? 'border-fantasy-gold shadow-glow' 
                : 'border-fantasy-pink hover:border-fantasy-gold'
            }`}
            onClick={() => onSelect(exp.id)}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-lalezar text-fantasy-black">
                {exp.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fantasy-black/80 leading-relaxed">
                {exp.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-fantasy-black"
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

export default ExperienceSelection;