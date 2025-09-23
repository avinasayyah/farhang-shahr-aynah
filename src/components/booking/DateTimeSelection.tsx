import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DatePicker from 'react-persian-calendar-date-picker';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateTimeSelectionProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}

const DateTimeSelection = ({ selectedDate, selectedTime, onSelect, onBack }: DateTimeSelectionProps) => {
  const [date, setDate] = useState<any>(
    selectedDate ? new Date(selectedDate) : null
  );
  const [time, setTime] = useState(selectedTime || '14:00'); // Default Tehran time
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
      // Convert Persian date to Gregorian
      const gregorianDate = new Date(date.year, date.month - 1, date.day);
      onSelect(gregorianDate.toISOString(), time);
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
            <div className="border-2 border-fantasy-pink rounded-lg p-4 bg-gradient-to-br from-white to-fantasy-gold/10 shadow-inner">
              <DatePicker
                value={date}
                onChange={setDate}
                inputPlaceholder="انتخاب تاریخ"
                formatInputText={() => date ? `${date.year}/${date.month}/${date.day}` : 'انتخاب تاریخ'}
                shouldHighlightWeekends
                locale="fa"
                calendarClassName="bg-white shadow-2xl border border-fantasy-gold rounded-xl overflow-hidden"
                inputClassName="w-full text-center text-fantasy-black border-none outline-none bg-transparent text-lg font-semibold"
                wrapperClassName="w-full"
                colorPrimary="#ec4899"
                colorPrimaryLight="rgba(236, 72, 153, 0.15)"
                renderInput={({ ref, ...rest }) => (
                  <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/50 border border-fantasy-pink/30">
                    <CalendarIcon className="h-5 w-5 text-fantasy-pink" />
                    <input {...rest} ref={ref} className="text-center font-semibold text-fantasy-black bg-transparent border-none outline-none flex-1" />
                  </div>
                )}
              />
            </div>
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
                ✨ قرار ملاقات شما: {date.year}/{date.month}/{date.day} ساعت {time} ✨
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-white bg-white/40 text-white hover:bg-white hover:text-fantasy-black font-bold"
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