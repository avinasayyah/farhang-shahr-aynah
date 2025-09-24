import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { cn } from '@/lib/utils';
import * as jalaali from 'jalaali-js';

// Persian month names
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Persian day names (Saturday first)
const persianDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// Gregorian -> Persian (Jalaali)
const gregorianToPersian = (gDate: Date) => {
  const { jy, jm, jd } = jalaali.toJalaali(gDate);
  return { year: jy, month: jm, day: jd };
};

// Persian (Jalaali) -> Gregorian
const persianToGregorian = (jy: number, jm: number, jd: number) => {
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return new Date(gy, gm - 1, gd);
};

// Days in Persian month
const getDaysInPersianMonth = (jy: number, jm: number) => jalaali.jalaaliMonthLength(jy, jm);

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
  const [currentYear, setCurrentYear] = useState(todayPersian.year); // e.g., 1404

  const selectedPersian = value ? gregorianToPersian(value) : null;
  const minPersian = minDate ? gregorianToPersian(minDate) : null;

  const daysInMonth = getDaysInPersianMonth(currentYear, currentMonth);
  const firstDayGregorian = persianToGregorian(currentYear, currentMonth, 1);
  const firstDayOfWeek = (firstDayGregorian.getDay() + 1) % 7; // Saturday=0

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
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
    return !!selectedPersian &&
      selectedPersian.year === currentYear &&
      selectedPersian.month === currentMonth &&
      selectedPersian.day === day;
  };

  const isToday = (day: number) => {
    return todayPersian.year === currentYear &&
      todayPersian.month === currentMonth &&
      todayPersian.day === day;
  };

  // Build calendar grid
  const calendarDays: Array<number | null> = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <Card className={cn("p-6 bg-gradient-to-br from-white via-fantasy-gold/5 to-fantasy-pink/5 border-2 border-fantasy-gold shadow-fantasy", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="h-10 w-10 p-0 hover:bg-fantasy-pink/10 rounded-full"
        >
          <ChevronRight className="h-5 w-5 text-fantasy-pink" />
        </Button>

        <motion.div
          key={`${currentYear}-${currentMonth}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold text-fantasy-black font-vazir">
            {persianMonths[currentMonth - 1]} {currentYear}
          </h3>
        </motion.div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="h-10 w-10 p-0 hover:bg-fantasy-pink/10 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-fantasy-pink" />
        </Button>
      </div>

      {/* Week header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {persianDays.map((day, index) => (
          <div key={index} className="h-10 flex items-center justify-center">
            <span className="text-sm font-bold text-fantasy-black/70 font-vazir">{day}</span>
          </div>
        ))}
      </div>

      {/* Days */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentYear}-${currentMonth}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-7 gap-2"
        >
          {calendarDays.map((day, idx) => (
            <div key={idx} className="h-12 flex items-center justify-center">
              {day && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDayClick(day)}
                  disabled={isDateDisabled(day)}
                  className={cn(
                    "h-10 w-10 p-0 text-sm font-vazir transition-all duration-200 rounded-full",
                    isSelectedDay(day) && "bg-fantasy-pink text-white hover:bg-fantasy-pink/90 shadow-glow ring-2 ring-fantasy-pink/50",
                    isToday(day) && !isSelectedDay(day) && "border-2 border-fantasy-gold text-fantasy-gold font-bold bg-fantasy-gold/10",
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
    const p = gregorianToPersian(value);
    return `${p.day} ${persianMonths[p.month - 1]} ${p.year}`;
  })() : placeholder;

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-right border-2 border-fantasy-pink focus:border-fantasy-gold hover:bg-fantasy-pink/5 font-vazir h-12"
      >
        <span className={cn(
          "font-vazir text-lg",
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
                onChange={(date) => { onChange?.(date); setIsOpen(false); }}
                minDate={minDate}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Utility: format Persian date
export const formatPersianDate = (date: Date): string => {
  const p = gregorianToPersian(date);
  return `${p.day} ${persianMonths[p.month - 1]} ${p.year}`;
};