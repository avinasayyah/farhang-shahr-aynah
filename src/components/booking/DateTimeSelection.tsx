import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateTimeSelectionProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}

const DateTimeSelection = ({ selectedDate, selectedTime, onSelect, onBack }: DateTimeSelectionProps) => {
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );
  const [time, setTime] = useState(selectedTime || '');
  const [errors, setErrors] = useState({ date: '', time: '' });

  const handleSubmit = () => {
    const newErrors = { date: '', time: '' };
    
    if (!date) {
      newErrors.date = 'لطفاً تاریخ را انتخاب کنید';
    }
    
    if (!time) {
      newErrors.time = 'لطفاً ساعت را انتخاب کنید';
    }
    
    setErrors(newErrors);
    
    if (!newErrors.date && !newErrors.time && date) {
      onSelect(date.toISOString(), time);
    }
  };

  // Generate tomorrow as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-lalezar text-white mb-4">
          تاریخ و ساعت مورد نظرتان را انتخاب کنید
        </h2>
        <p className="text-white/90">
          زمان شما، زمان ما است 📅
        </p>
      </div>

      <Card className="bg-card-gradient border-2 border-fantasy-gold shadow-fantasy backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-lalezar text-fantasy-black text-center">
            📅 انتخاب تاریخ و ساعت
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-fantasy-black font-bold">تاریخ ملاقات</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal border-2 border-fantasy-pink",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: faIR })
                  ) : (
                    <span>انتخاب تاریخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < tomorrow}
                  initialFocus
                  className="pointer-events-auto bg-white"
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-destructive text-sm">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-fantasy-black font-bold">ساعت ملاقات</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border-2 border-fantasy-pink focus:border-fantasy-gold text-center text-lg"
              dir="ltr"
            />
            {errors.time && (
              <p className="text-destructive text-sm">{errors.time}</p>
            )}
          </div>

          {date && time && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-fantasy-gold/20 p-4 rounded-lg border-2 border-fantasy-gold"
            >
              <p className="text-fantasy-black font-bold text-center">
                ✨ قرار ملاقات شما: {format(date, "PPP", { locale: faIR })} ساعت {time} ✨
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-white text-white hover:bg-white hover:text-fantasy-black"
        >
          بازگشت
        </Button>
        
        <Button
          onClick={handleSubmit}
          className="bg-button-gradient hover:scale-105 transform transition-all duration-200 shadow-glow text-white font-bold px-8"
        >
          ادامه ✨
        </Button>
      </div>
    </motion.div>
  );
};

export default DateTimeSelection;