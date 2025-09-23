import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { cn } from '@/lib/utils';

// Persian month names
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Persian day names
const persianDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// Convert Gregorian to Persian date
const gregorianToPersian = (gDate: Date) => {
  const gy = gDate.getFullYear();
  const gm = gDate.getMonth() + 1;
  const gd = gDate.getDate();
  
  let jy, jm, jd;
  
  if (gy <= 1600) {
    jy = 0; jm = 0; jd = 0;
  } else {
    jy = 979;
    gy >= 1600 && (jy += 33 * Math.floor((gy - 1600) / 33));
    gy >= 1600 && (jy += 4 * Math.floor(((gy - 1600) % 33) / 4));
    (gy - 1600) % 33 % 4 !== 0 && (jy += (gy - 1600) % 33 % 4);
  }
  
  const leap = ((jy + 2346) % 128) % 33 % 4;
  let jp = 0;
  
  for (let i = 0; i < gm - 1; ++i) {
    jp += [31, (leap === 0 && gy % 4 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
  }
  jp += gd;
  
  if (jp <= 79) {
    jy--;
    jp += (leap === 0) ? 366 : 365;
  }
  jp -= 79;
  
  if (jp <= 186) {
    jm = 1 + Math.floor((jp - 1) / 31);
    jd = 1 + ((jp - 1) % 31);
  } else {
    jm = 7 + Math.floor((jp - 187) / 30);
    jd = 1 + ((jp - 187) % 30);
  }
  
  return { year: jy, month: jm, day: jd };
};

// Convert Persian to Gregorian date
const persianToGregorian = (jy: number, jm: number, jd: number) => {
  let gy, gm, gd;
  
  jy += 979;
  let jp = 0;
  
  for (let i = 0; i < jm - 1; ++i) {
    jp += (i < 6) ? 31 : 30;
  }
  jp += jd;
  
  const leap = ((jy + 2346) % 128) % 33 % 4;
  jp += (leap === 0) ? 79 : 80;
  
  gy = 1600 + 33 * Math.floor((jy - 979) / 33) + 4 * Math.floor(((jy - 979) % 33) / 4);
  ((jy - 979) % 33) % 4 !== 0 && (gy += ((jy - 979) % 33) % 4);
  
  const gLeap = (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0);
  const sal_a = [31, gLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  gm = 0;
  while (gm < 12 && jp > sal_a[gm]) {
    jp -= sal_a[gm];
    gm++;
  }
  gm++;
  gd = jp;
  
  return new Date(gy, gm - 1, gd);
};

// Get days in Persian month
const getDaysInPersianMonth = (year: number, month: number) => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  // Check if leap year
  const leap = ((year + 2346) % 128) % 33 % 4;
  return leap === 0 ? 30 : 29;
};

interface PersianCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

export const PersianCalendar: React.FC<PersianCalendarProps> = ({
  value,
  onChange,
  minDate,
  className
}) => {
  const today = new Date();
  const todayPersian = gregorianToPersian(today);
  const [currentMonth, setCurrentMonth] = useState(todayPersian.month);
  const [currentYear, setCurrentYear] = useState(todayPersian.year);
  
  const selectedPersian = value ? gregorianToPersian(value) : null;
  const minPersian = minDate ? gregorianToPersian(minDate) : null;
  
  const daysInMonth = getDaysInPersianMonth(currentYear, currentMonth);
  const firstDayGregorian = persianToGregorian(currentYear, currentMonth, 1);
  const firstDayOfWeek = (firstDayGregorian.getDay() + 1) % 7; // Convert to Persian week start
  
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const handleDayClick = (day: number) => {
    const selectedDate = persianToGregorian(currentYear, currentMonth, day);
    if (minDate && selectedDate < minDate) return;
    onChange?.(selectedDate);
  };
  
  const isDateDisabled = (day: number) => {
    if (!minPersian) return false;
    if (currentYear < minPersian.year) return true;
    if (currentYear === minPersian.year && currentMonth < minPersian.month) return true;
    if (currentYear === minPersian.year && currentMonth === minPersian.month && day < minPersian.day) return true;
    return false;
  };
  
  const isSelectedDay = (day: number) => {
    return selectedPersian && 
           selectedPersian.year === currentYear && 
           selectedPersian.month === currentMonth && 
           selectedPersian.day === day;
  };
  
  const isToday = (day: number) => {
    return todayPersian.year === currentYear && 
           todayPersian.month === currentMonth && 
           todayPersian.day === day;
  };
  
  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before month start
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  return (
    <Card className={cn("p-4 bg-gradient-to-br from-white to-fantasy-gold/5 border-2 border-fantasy-gold shadow-fantasy", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="h-8 w-8 p-0 hover:bg-fantasy-pink/10"
        >
          <ChevronRight className="h-4 w-4 text-fantasy-pink" />
        </Button>
        
        <motion.div 
          key={`${currentYear}-${currentMonth}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-lg font-bold text-fantasy-black font-vazir">
            {persianMonths[currentMonth - 1]} {currentYear}
          </h3>
        </motion.div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="h-8 w-8 p-0 hover:bg-fantasy-pink/10"
        >
          <ChevronLeft className="h-4 w-4 text-fantasy-pink" />
        </Button>
      </div>
      
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {persianDays.map((day, index) => (
          <div key={index} className="h-8 flex items-center justify-center">
            <span className="text-sm font-bold text-fantasy-black/70 font-vazir">
              {day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`${currentYear}-${currentMonth}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map((day, index) => (
            <div key={index} className="h-10 flex items-center justify-center">
              {day && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDayClick(day)}
                  disabled={isDateDisabled(day)}
                  className={cn(
                    "h-8 w-8 p-0 text-sm font-vazir transition-all duration-200",
                    isSelectedDay(day) && "bg-fantasy-pink text-white hover:bg-fantasy-pink/90 shadow-glow",
                    isToday(day) && !isSelectedDay(day) && "border-2 border-fantasy-gold text-fantasy-gold font-bold",
                    !isSelectedDay(day) && !isToday(day) && "hover:bg-fantasy-pink/10 text-fantasy-black",
                    isDateDisabled(day) && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {day}
                </Button>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

interface PersianDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  className?: string;
}

export const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  minDate,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const displayText = value ? (() => {
    const persian = gregorianToPersian(value);
    return `${persian.year}/${persian.month}/${persian.day}`;
  })() : placeholder;
  
  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-right border-2 border-fantasy-pink focus:border-fantasy-gold hover:bg-fantasy-pink/5 font-vazir"
      >
        <span className={cn(
          "font-inter text-lg",
          value ? "text-fantasy-black font-semibold" : "text-fantasy-black/60"
        )}>
          {displayText}
        </span>
        <Calendar className="h-5 w-5 text-fantasy-pink" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 z-50 mt-2"
            >
              <PersianCalendar
                value={value}
                onChange={(date) => {
                  onChange?.(date);
                  setIsOpen(false);
                }}
                minDate={minDate}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};